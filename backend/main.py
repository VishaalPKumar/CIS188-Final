from typing import List

from fastapi import FastAPI
import requests
import json
import yaml
import os
import base64

from pydantic import BaseModel
from starlette.responses import Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

EVENTS_URL = (
    "https://api.github.com/repos/dlike230/CIS188-Project/contents/data/events.yaml"
)
TOKEN = os.getenv("GITHUB_TOKEN")
print(TOKEN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MetadataFetchException(Exception):
    def __init__(self, response):
        self.response = response


def get_metadata():
    metadata_response = requests.get(
        EVENTS_URL, headers={"Authorization": f"token {TOKEN}"}
    )

    if metadata_response.status_code != 200:
        raise MetadataFetchException(metadata_response)

    return json.loads(metadata_response.content)


@app.get("/events")
def get_events():
    try:
        metadata = get_metadata()
    except MetadataFetchException as e:
        return Response(content=e.response.content, status_code=e.response.status_code)
    download_url = metadata["download_url"]
    return yaml.safe_load(requests.get(download_url).content)


class Event(BaseModel):
    date: str
    time: str
    description: str
    name: str


class Events(BaseModel):
    events: List[Event]


@app.post("/updateEvents")
def update_events(events: Events):
    new_data = events.dict()
    new_yaml = yaml.safe_dump(new_data)

    try:
        metadata = get_metadata()
    except MetadataFetchException as e:
        return Response(content=e.response.content, status_code=e.response.status_code)

    data = {
        "message": "Update events",
        "sha": metadata["sha"],
        "branch": "master",
        "committer": {"name": "Daniel Like", "email": "dlike230@gmail.com"},
        "content": base64.b64encode(str.encode(new_yaml)).decode(),
    }

    res = requests.put(
        EVENTS_URL,
        data=json.dumps(data),
        headers={"Authorization": f"token {TOKEN}", "Content-Type": "application/json"},
    )

    return Response(content=res.content, status_code=res.status_code)

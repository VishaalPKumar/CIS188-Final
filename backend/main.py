from fastapi import FastAPI
import requests
import json
import yaml

app = FastAPI()


@app.get("/events")
def get_events():
    metadata_response = requests.get(
        "https://api.github.com/repos/VishaalPKumar/CIS188-Project/contents/data/events.yaml",
        headers={"Authorization": "token ***REMOVED***"}
    ).content

    download_url = json.loads(metadata_response)["download_url"]

    return yaml.safe_load(requests.get(download_url).content)

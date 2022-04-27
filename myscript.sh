#!/bin/bash
kubectl config use-context kind-cis188
docker build backend -t backend:v1
docker build frontend -t frontend:v1
kind load docker-image backend:v1 --name cis188
kind load docker-image frontend:v1 --name cis188
kubectl apply -f k8s/
kubectl port-forward svc/web  3000:3000

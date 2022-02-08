#!/bin/bash

# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -v

DIR="$(dirname "$0")"
. "${DIR}/config"

## Replaying on Google Cloud

# Configure your local `gcloud` to use your project:
gcloud config set project ${PROJECT_ID}

# Configure a region to use for Cloud Run:
gcloud config set run/region ${REGION}

# Create a new Artifact Registry container repository:
gcloud artifacts repositories create containers --repository-format=docker --location=${REGION}

# Build this repository into a container image:
gcloud builds submit -t us-central1-docker.pkg.dev/${PROJECT_ID}/containers/user-journeys-demo

# Create a service account that has no permission, this will ensure replayed user journeys cannot access any of your Google Cloud resources. 
gcloud iam service-accounts create no-permission --description="No IAM permission"

# Create a Cloud Run job:
gcloud alpha run jobs create user-journeys-demo \
  --image us-central1-docker.pkg.dev/${PROJECT_ID}/containers/user-journeys-demo:latest \
  --service-account no-permission@${PROJECT_ID}.iam.gserviceaccount.com

# Run the Cloud Run job:
gcloud alpha run jobs run user-journeys-demo
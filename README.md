# User Journeys demo

This demo shows how to replay recorded user journeys of your website on Cloud Run jobs.

## Record your user journeys

1. Use [Chrome DevTools' Recorder](https://developer.chrome.com/docs/devtools/recorder/) to record critical user journeys for your publicly accessible website.
1. Export the replay using DevTools' Recorder [export feature](https://developer.chrome.com/docs/devtools/recorder/#edit-flows)
1. Save the exported `.js` file under the `journeys/` folder.

## Replaying on Google Cloud

1. Install the [`gcloud` command line](https://cloud.google.com/sdk/docs/install).
1. Create a Google Cloud project.
1. Set some environment variables.
   Replace `my-project-id` with the identified of the Google Cloud project created above.
   Replace `us-central1` with any [available regions](https://cloud.google.com/run/docs/locations)
   ```
   PROJECT_ID=my-project-id
   REGION=us-central1
   ```
1. Configure your local `gcloud` to use your project:
   ```
   gcloud config set project ${PROJECT_ID}
   ```
1. Configure a region to use for Cloud Run:
   ```
   gcloud config set run/region ${REGION}
   ```
1. Create a new Artifact Registry container repository:
   ```
   gcloud artifacts repositories create containers --repository-format=docker --location=${REGION}
   ```
1. Build this repository into a container image:
   ```
   gcloud builds submit -t us-central1-docker.pkg.dev/${PROJECT_ID}/containers/user-journeys-demo
   ```
1. Create a service account that has no permission, this will ensure replayed user journeys cannot access any of your Google Cloud resources. 
   ```
   gcloud iam service-accounts create no-permission --description="No IAM permission"
   ```

1. Create a Cloud Run job, replace `your-site.com/user-journey.js` with the relative link to your user journey `.js` file:
   ```
   gcloud alpha run jobs create user-journeys-demo \
      --image us-central1-docker.pkg.dev/${PROJECT_ID}/containers/user-journeys-demo:latest \
      --service-account no-permission@${PROJECT_ID}.iam.gserviceaccount.com
   ```
1. Run the Cloud Run job:
   ```
   gcloud alpha run jobs run user-journeys-demo
   ```

## Replaying every day

1. Create a new service account
   ```
   gcloud iam service-accounts create job-runner --description="Can run Cloud Run Jobs"
   ```
1. Grant this Service account the permission to run the Cloud Run job
   ```
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
      --member="serviceAccount:job-runner@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/run.invoker"
   ```
1. Create a Cloud Scheduler Job that will run the Cloud Run Job everyday.
   ```
   gcloud scheduler jobs create http job-runner \
      --schedule='0 12 * * *' \
      --uri=https://${REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${PROJECT_ID}/jobs/user-journeys-demo:run \
      --message-body='' \
      --oauth-service-account-email=job-runner@${PROJECT_ID}.iam.gserviceaccount.com \
      --oauth-token-scope=https://www.googleapis.com/auth/cloud-platform
   ```
1. Test that Cloud Scheduler can correctly run the Cloud Run job:
   ```
   gcloud scheduler jobs run job-runner
   ```

## Testing locally

The following steps assume you have `docker` installed on your local machine. If you don't proceed to the next section to deploy to Google Cloud.

Build with:

```
docker build . -t user-journeys-demo
```

Run locally:

```
docker run --cap-add=SYS_ADMIN user-journeys-demo
```


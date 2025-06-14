# Call Transcript API

This application provides an API endpoint for fetching call transcripts from Go High Level using the [Get Transcription by Message ID](https://highlevel.stoplight.io/docs/integrations/9f8e2c1696a55-get-transcription-by-message-id) API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following contents:
```
PORT=8000
GO_HIGH_LEVEL_API_KEY=your_api_key_here
GO_HIGH_LEVEL_ACCESS_TOKEN=your_access_token_here
GO_HIGH_LEVEL_BASE_URL=https://api.gohighlevel.com

# GoHighLevel OAuth Configuration
GO_HIGH_LEVEL_CLIENT_ID=your_client_id
GO_HIGH_LEVEL_CLIENT_SECRET=your_client_secret
GO_HIGH_LEVEL_REDIRECT_URI=https://your-app.com/api/auth/callback
GO_HIGH_LEVEL_USER_TYPE=Location
```

3. Run the application:
```bash
npm run dev
```

## API Endpoints

### OAuth Token Exchange

```
GET /api/auth/callback?code=authorization_code
```

Exchanges an authorization code for an access token from GoHighLevel.

#### Query Parameters

- `code`: The authorization code received from GoHighLevel after user authorization

#### Response

```json
{
  "success": true,
  "data": {
    "access_token": "your_access_token",
    "refresh_token": "your_refresh_token",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

### Get Call Transcript

```
GET /api/transcript/:messageId
```

Fetches a transcript for a specific call using the message ID.

#### URL Parameters

- `messageId`: The ID of the message to fetch the transcript for

#### Response

```json
{
  "success": true,
  "data": {
    // Transcript data returned from Go High Level
  }
}
```

## Error Handling

Errors are returned in the following format:

```json
{
  "success": false,
  "message": "Error message details"
}
```

# Build and Deploy Application

## Prerequisites
- Node.js (v16 or higher)
- pnpm package manager
- Google Cloud account with appropriate permissions
- Google Cloud project created and configured

## Step 1: Install Google Cloud CLI (gcloud CLI)
1. Visit the [Google Cloud SDK installation guide](https://cloud.google.com/sdk/docs/install)
2. Download the appropriate installer for your operating system
3. Run the installer and follow the prompts
4. Verify installation by opening a new terminal and running:
   ```bash
   gcloud --version
   ```
   You should see the gcloud CLI version information

## Step 2: Google Cloud Authentication
1. Open a terminal and run:
   ```bash
   gcloud auth login
   ```
2. A browser window will open automatically
3. Sign in with your Google Cloud account that has project access
4. Verify authentication:
   ```bash
   gcloud auth list
   ```
   Your account should be listed as active

## Step 3: Configure Google Cloud Project
1. List available projects:
   ```bash
   gcloud projects list
   ```
2. Set your project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```
   Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID
3. Verify project configuration:
   ```bash
   gcloud config get-value project
   ```

## Step 4: Build the Application
1. Ensure all dependencies are installed:
   ```bash
   pnpm install
   ```
2. Run the build command:
   ```bash
   pnpm run build
   ```

## Step 5: Deploy to Google Cloud
1. Ensure you're in the project root directory
2. Run the deployment command:
   ```bash
   pnpm run deploy
   ```
3. Monitor the deployment:
   - Watch the console output for deployment status
   - Note the deployed URL or service endpoint
   - Check Google Cloud Console for deployment status

## Troubleshooting

### Common Issues and Solutions

1. **Authentication Issues**
   - If `gcloud auth login` fails, try:
     ```bash
     gcloud auth login --no-launch-browser
     ```
   - Follow the provided URL manually

2. **Project Configuration Issues**
   - If project setting fails, verify project ID:
     ```bash
     gcloud projects list
     ```
   - Ensure you have the necessary IAM permissions

3. **Build Failures**
   - Clear node_modules and reinstall:
     ```bash
     rm -rf node_modules
     pnpm install
     ```
   - Check for TypeScript/compilation errors
   - Verify environment variables are set correctly

4. **Deployment Failures**
   - Check Google Cloud Console for detailed error logs
   - Verify service account permissions
   - Ensure billing is enabled for the project
   - Check quota limits and usage

### Verifying Deployment

1. Check service status:
   ```bash
   gcloud app services list
   ```

2. View application logs:
   ```bash
   gcloud app logs tail
   ```

3. Test the deployed endpoints using the provided URL

### Rollback (if needed)

1. List previous deployments:
   ```bash
   gcloud app versions list
   ```

2. Rollback to a previous version:
   ```bash
   gcloud app services set-traffic default --splits=VERSION_ID=1
   ```
   Replace `VERSION_ID` with the version you want to roll back to

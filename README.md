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
``` #   t r a n s c r i p t i o n - a p p 
 
 
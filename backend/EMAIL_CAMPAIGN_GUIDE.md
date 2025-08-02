# Email Campaign Guide - Asiur Wear

This guide explains how to use the email campaign functionality integrated with Brevo (formerly Sendinblue) API.

## Setup

### 1. API Key Configuration
Your Brevo API key is already configured in `config.env`:
```
BREVO_API_KEY=3yNECDOSkv26mPn8
```

### 2. Dependencies
The Brevo SDK has been installed:
```bash
npm install sib-api-v3-sdk
```

## API Endpoints

### 1. Create Email Campaign
**POST** `/api/campaigns/create`

**Request Body:**
```json
{
  "name": "Campaign Name",
  "subject": "Email Subject",
  "sender": {
    "name": "Asiur Wear",
    "email": "noreply@asiurwear.com"
  },
  "type": "classic",
  "htmlContent": "<p>Your HTML content here</p>",
  "recipients": {
    "listIds": [2, 7]
  },
  "scheduledAt": "2024-01-01 00:00:01" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email campaign created successfully",
  "campaignId": 123
}
```

### 2. Get All Campaigns
**GET** `/api/campaigns/list`

**Response:**
```json
{
  "success": true,
  "message": "Email campaigns retrieved successfully",
  "campaigns": [...]
}
```

### 3. Send Campaign
**POST** `/api/campaigns/send/:campaignId`

**Response:**
```json
{
  "success": true,
  "message": "Email campaign sent successfully",
  "data": {...}
}
```

### 4. Create Example Campaign
**POST** `/api/campaigns/create-example`

Creates a pre-designed welcome campaign with Asiur Wear branding.

## Usage Examples

### Using the Service Directly

```javascript
const brevoService = require('./services/brevoService');

// Create a campaign
const campaignData = {
  name: "Welcome Campaign",
  subject: "Welcome to Asiur Wear!",
  sender: {
    name: "Asiur Wear",
    email: "noreply@asiurwear.com"
  },
  type: "classic",
  htmlContent: `
    <div>
      <h1>Welcome to Asiur Wear!</h1>
      <p>Discover your style with our premium t-shirts.</p>
    </div>
  `,
  recipients: { listIds: [2, 7] }
};

const result = await brevoService.createEmailCampaign(campaignData);
if (result.success) {
  console.log('Campaign created:', result.campaignId);
}
```

### Using the API Endpoints

```javascript
// Create campaign
const response = await fetch('/api/campaigns/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(campaignData)
});

// Get campaigns
const campaigns = await fetch('/api/campaigns/list');

// Send campaign
const sendResult = await fetch(`/api/campaigns/send/${campaignId}`, {
  method: 'POST'
});
```

## Testing

Run the test script to verify the functionality:

```bash
node test-campaign.js
```

This will:
1. Create a test campaign
2. Send the campaign
3. Retrieve all campaigns
4. Display results

## Campaign Templates

### Welcome Campaign Template
The service includes a pre-designed welcome campaign template with:
- Asiur Wear branding
- Professional styling
- Call-to-action button
- Responsive design

### Custom Templates
You can create custom HTML templates. Here's a basic structure:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
    <h1 style="color: #333;">Your Title</h1>
    <p style="color: #666;">Your content here</p>
    <a href="https://asiurwear.com" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
      Call to Action
    </a>
  </div>
</div>
```

## Important Notes

1. **List IDs**: Replace `[2, 7]` with your actual Brevo contact list IDs
2. **Sender Email**: Use a verified sender email in your Brevo account
3. **API Limits**: Be mindful of Brevo's API rate limits
4. **Testing**: Always test campaigns with a small list before sending to all subscribers

## Error Handling

The service includes comprehensive error handling:
- API authentication errors
- Invalid campaign data
- Network issues
- Rate limiting

All errors are logged and returned with descriptive messages.

## Security

- API key is stored in environment variables
- Input validation on all endpoints
- Rate limiting implemented
- CORS configured for production domains

## Support

For issues with the email campaign functionality:
1. Check the server logs for detailed error messages
2. Verify your Brevo API key is correct
3. Ensure your contact lists exist in Brevo
4. Test with the provided test script 
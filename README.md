# LINE Echo Bot

## Configuration

Create `.env` file and fill in the values. You can get the channel access token from the [LINE Developers Console](https://developers.line.biz/console).

```bash
LINE_CHANNEL_ACCESS_TOKEN={<CHANNEL1_USER_ID>:<CHANNEL1_ACCESS_TOKEN>,<CHANNEL2_USER_ID>:<CHANNEL2_ACCESS_TOKEN>, ...}
```

For variable `LINE_CHANNEL_ACCESS_TOKEN`, you can set to support single or multiple channels. If you want to support multiple channels, you can set the value as a JSON object. The key is the User ID of the channel and the value is the channel access token. otherwise, you can set the value as a string.

```bash
LINE_CHANNEL_ACCESS_TOKEN=<CHANNEL_ACCESS_TOKEN>
```

### Example Configuration

```bash
LINE_CHANNEL_ACCESS_TOKEN={"U12ab34567c8d012ef3g45h67890i123j":"[CHANNEL_ACCCESS_TOKEN]","U12ab34567c8d012ef3g45h67890i275j":"[CHANNEL_ACCCESS_TOKEN]"}
```
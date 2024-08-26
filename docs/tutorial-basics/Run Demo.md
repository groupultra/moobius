---
id: Run Demo
---

The Moobius Python SDK is designed for developers to get hands on Moobius quickly and smoothly. It incorporates all the low-level communication APIs, and organizes them in a well-structured way. This tutorial will focus on the basic usage of SDK to develop a Moobius CCS, but there are also a bunch of advanced features (database adaptors, wands, agents, loggers) that facilitates management of complicated GBAs, Cyborgs, and custom User clients with full flexibility.

After the SDK is installed, you can change the current directory of your console (with cd command) to a directory you would like to put your code into (we will call it your project directory later), and run

### install

```shell
python -m moobius
```

on your console. This will create a basic template of a runnable CCS python program, along with necessary configuration files. The structure of your project directory would now look like this (the log directory may not appear before your first run of the program):

```text
|-- project
    |-- config
        |-- db.json
        |-- service.json
    |-- logs
        |-- error.log
        |-- service.log
    |-- readme.md
    |-- service.py
    |-- main.py
```

## config

You will see a config directory in your project directory, and a file named service.json inside it, which looks like this:

```json
{
  "http_server_uri": "https://api.moobius.net/",
  "ws_server_uri": "wss://ws.moobius.net/",
  "email": "<name@site.com>",
  "password": "<secret>",
  "service_id": "",
  "channels": ["<channel-id>"],
  "others": "include"
}
```

You need to change the `email`, `password` and `channels` field to your account credentials and your Channel ID (Do not keep the `<>` inside the `""` after replacement, but do not remove the `[]` in the `channels` field. It is supposed to be a JSON list of strings, and you can have multiple Channel IDs in that field), and then save the file.

:::tip
Even you don't have to know it for now, you may be curious about the `service_id` field. Technically, any Custom Channel Service has a unique Service ID on the Moobius Platform as an identifier. One User account can have multiple Service IDs under its name, and each Service ID could be associated with multiple Channels simultaneously. Each Service ID establishes a unique websocket connection to the Moobius platform. When a User Triggers an Upward Event in a Channel, the Moobius Platform will search for the Service ID associated with the Channel, and forward the Event to the Websocket connection. For the purpose of making a new demo, you don't have to fill in the `service_id` field. The SDK will request a new Service ID for you and automatically populate that field. However, the Channel is then associated with that Service ID afterwards (even if you stops the program), so that you may want to write down your Service ID if the Channel is important for you. (todo: detailed explanation of Service association/dissociation and `others` field)
:::

## Moobius Python SDK

Typically, one program based on our Moobius Python SDK has one "working process" that takes care of one Service ID (i.e. one Websocket connection, but could work on multiple Channels), but the MoobiusWand feature in our SDK allows for a "control process" controlling multiple "working processes" simultaneously, all in one program, which could be useful for large-scale infrastructure of GBA "clusters". The usage of MoobiusWand will be covered in our advanced tutorial.

Alternatively, you can use

```shell
python -m moobius --gui
```

to fill your credentials, Channel ID and code directory with GUI (this may not work if you are working on a cloud instance which does not show GUI).

You can see a `service.py` file and a `main.py` file, among other configuration files, that look like this:

```python
# service.py
from moobius import Moobius, types


class ZeroService(Moobius):
    pass
```

```python
# main.py
from service import ZeroService
from moobius import MoobiusWand

if __name__ == "__main__":
    wand = MoobiusWand()
    handle = wand.run(ZeroService, ..., background=True)
```

There seems to be nothing in `ZeroService`, but everything fundamental has been nicely packed into the `Moobius` class (network connection, authentication, keep-alive, logging, error handling, API, etc). Additionally, as the core of our SDK, `Moobius` class provides a series of handy functionalities that will be elaborated later. For now, all our `ZeroService` needs to do is to just inherit everything from Moobius and it suffices to start a legit (but trivial) Service. In later sections, we will guide you step-by-step on how to implement a functional CCS starting from this empty Service template.

The file `main.py` is the launcher of the Service. It uses a `MoobiusWand` instance to actually start the Service. This `Wand` feature can manage multiple Services simultaneously non-blocking, and emit external injection Events (`spell`) to each Service. For now we can safely skip the details and just use it as a simple launcher. For more information of Moobius Wands, please refer to our Advanced Tutorial.

After you have everything configured properly, you can run your first CCS program on your console (remember to check the working directory of your console is the project directory you specified and has main.py in it.

```shell
python main.py
```

Wait for a few seconds. If you see logs like this on your console, then it is very likely that your CCS is running!

```shell
2024-07-01 15:16:00.437 | INFO     | moobius.network.ws_client:receive:128 - {"type": "copy", "body": {"request_id": "bf47b805-dc7d-4975-a374-466f5891a09a", "origin_type": "heartbeat", "status": true, "context": {}}}
2024-07-01 15:16:00.437 | DEBUG    | moobius.core.sdk:on_copy_client:922 - on_copy_client
2024-07-01 15:16:00.473 | INFO     | moobius.network.ws_client:receive:128 - {"type": "copy", "body": {"request_id": "c83b8ee4-409c-497d-9f39-78bc30ad3b6b", "origin_type": "heartbeat", "status": true, "context": {}}}
2024-07-01 15:16:00.473 | DEBUG    | moobius.core.sdk:on_copy_client:922 - on_copy_client
```

Go back to your browser for Moobius and refresh your Channel page. You should see the logo next to the Channel title has changed, which indicates a Service has taken over the Channel. You can then send something like "hello world" in the Channel, and you should expect a log appearing in your console like this:

```shell
2024-07-01 17:24:28.479 | INFO     | moobius.network.ws_client:receive:128 - {"type": "message_up", "body": {"subtype": "text", "content": {"text": "hello world"}, "channel_id": "229e6c38-39fb-40b6-9a9a-0f5b0182de85", "timestamp": 1719869068282, "recipients": "24703ea7-a07a-4398-bcd0-396d3db5e60a", "message_id": "35d340ae-351e-47b4-93c8-96124bb08600", "context": {"group_id": "24703ea7-a07a-4398-bcd0-396d3db5e60a", "group_name": "Baozi", "character_num": 1, "channel_type": "ccs"}, "sender": "f6a8ae7f-0382-40f2-b4db-3237326b9a00"}}
```

Notice the `"content": {"text": "hello world"}` part. This demonstrates that this Message is already sent to your CCS.

:::tip
The SDK uses loguru for logging. Logs are not only printed to console, but saved in the log directory under your working directory (which can be automatically created). Using a logging system instead of print() is considered a more graceful approach, especially if you want to build something serious instead of a toy. You can add your own logs anywhere in your program with calls like logger.info("Your log"), after you make from loguru import logger statement at the beginning of your code file. For detailed usages of loguru, please refer to GitHub - Delgan/loguru: Python logging made (stupidly) simple.
:::

🌟 Congratulations! You are officially a Moobius Developer now, and let's explore the wonderful world of GBA!

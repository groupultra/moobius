---
id: Run Demo
---

The Moobius Python SDK is designed for developers to get Moobius up and running quickly and smoothly. It incorporates all the low-level communication APIs and organizes them in a well-structured consistent way. This tutorial will focus on the basic usage of SDK to develop a Moobius CCS, but there are also a bunch of advanced features (database adaptors, wands, schedulers, etc) that facilitates management of complicated GBAs, Cyborgs, and custom User clients with full flexibility.

After the SDK is installed, you can change the current directory of your console (with cd command) to a directory you would like to put your code into (your project directory), and run in your terminal:

### install

```shell
moobius
```

Alternatively, you can use

```shell
moobius --gui # Opens a GUI.
```

Note that GUI mode will not work if you are working on a cloud instance which does not have a GUI or windowing system installed.

If you don't specify any parameters, it will prompt you for an email and password. You can enter empty credentials if you don't have an account yet. If so, you will need to save them in the account.json file in order to use the service (see below). (A new Channel will be automatically created if you enter correct credentials).

After this runs, you will have a basic template of a runnable CCS python program along with the necessary configuration files. The structure of your project directory would now look like this:

```text
|-- project
    |-- config
        |-- account.json
        |-- config.json
        |-- log.json
        |-- db.json
        |-- service.json
    |-- logs (this folder will appear on the first run)
        |-- error.log
        |-- service.log
    |-- readme.md
    |-- service.py
```

## config

You will see a `config` directory in your project directory, and a file named `account.json` inside it, which looks like this:

```json
{
  "email": "test@example.com",
  "password": "YourPassword"
}
```

If you did not previously enter your credentials, you will need to change the `email` and `password` field to your own account credentials. Save the file, and open another file named `service.json`:

```json
{
  "http_server_uri": "https://api.moobius.link/",
  "ws_server_uri": "wss://ws.moobius.link/",
  "service_id": "123123",
  "channels": ["123123"],
  "others": "include"
}
```

You will have to fill in your Channel ID if you did not give the credentials originally and did not specifiy a channel; otherwise it will have created a channel for you. Note the `[]` in the `channels` field! It is a JSON list of strings. Which means you can have multiple Channel IDs in that field (seperated by commas). Do not fill in a service ID, it will fill one in for you. Unless your channel has previously been used by another CCS app, then you have to use that service ID.

:::tip
Even you don't have to know it for now, you may be curious about the `service_id` field. Technically, any Custom Channel Service has a unique Service ID on the Moobius Platform as an identifier. One User account can have multiple Service IDs under its name, and each Service ID could be associated with multiple Channels simultaneously. Each Service ID establishes a unique websocket connection to the Moobius platform. When a User Triggers an Upward Event in a Channel, the Moobius Platform will search for the Service ID associated with the Channel, and forward the Event to the Websocket connection. For the purpose of making a new demo, you don't have to fill in the `service_id` field. The SDK will request a new Service ID for you and automatically populate that field. However, the Channel is then associated with that Service ID afterwards (even if you stops the program), so that you may want to write down your Service ID if the Channel is important for you. (todo: detailed explanation of Service association/dissociation and `others` field)
:::

Typically, one program based on our Moobius Python SDK has one "working process" that takes care of one Service ID (i.e. one Websocket connection, but could work on multiple Channels), but the `MoobiusWand` feature in our SDK allows for a "control process" controlling multiple "working processes" simultaneously, all in one program, which could be useful for large-scale infrastructure of GBA "clusters". The usage of `MoobiusWand` will be covered in our advanced tutorial.

## starting

Your starting `service.py` looks like this:

```python
# service.py
from moobius import Moobius, MoobiusWand, types


class ZeroService(Moobius):
    pass


if __name__ == '__main__':
    MoobiusWand().run(ZeroService, config='config/config.json', background=True)
```

There seems to be nothing in `ZeroService`, but everything fundamental has been nicely packed into the `Moobius` class (network connection, authentication, keep-alive, logging, error handling, API, etc). Additionally, as the core of our SDK, `Moobius` class provides a series of handy functionalities that will be elaborated later. For now, all our `ZeroService` needs to do is to just inherit everything from `Moobius` and when run it will start a valid (but trivial) Service. In later sections, we will guide you step-by-step on how to implement a functional CCS starting from this empty Service template.

You may notice that a `MoobiusWand` instance is created as the launcher to actually start the Service. This `Wand` feature can manage multiple Services simultaneously running in different processess, and send external injection Events (`spell`) to each Service. For now we can safely skip the details and just use it as a simple launcher. For more information about Moobius Wands, please refer to our Advanced Tutorial.

After you have everything configured properly, you can run your first CCS program on your console (remember to check the working directory of your console is the project directory you specified and has `service.py` in it.

```python
python service.py
```

Wait for a few seconds. If you see logs like this on your console, then it is very likely that your CCS is running!

```shell
2024-07-01 15:16:00.437 | INFO     | moobius.network.ws_client:receive:128 - {"type": "copy", "body": {"request_id": "bf47b805-dc7d-4975-a374-466f5891a09a", "origin_type": "heartbeat", "status": true, "context": {}}}
2024-07-01 15:16:00.437 | DEBUG    | moobius.core.sdk:on_copy_client:922 - on_copy_client
2024-07-01 15:16:00.473 | INFO     | moobius.network.ws_client:receive:128 - {"type": "copy", "body": {"request_id": "c83b8ee4-409c-497d-9f39-78bc30ad3b6b", "origin_type": "heartbeat", "status": true, "context": {}}}
2024-07-01 15:16:00.473 | DEBUG    | moobius.core.sdk:on_copy_client:922 - on_copy_client
```

Go back to your browser for Moobius and refresh your Channel page. You should see the badge next to the Channel title has changed, which indicates a Service has taken over the Channel. You can then send something like "hello world" in the Channel, and you should expect a log appearing in your console like this

```shell
2024-07-01 17:24:28.479 | INFO     | moobius.network.ws_client:receive:128 - {"type": "message_up", "body": {"subtype": "text", "content": {"text": "hello world"}, "channel_id": "229e6c38-39fb-40b6-9a9a-0f5b0182de85", "timestamp": 1719869068282, "recipients": "24703ea7-a07a-4398-bcd0-396d3db5e60a", "message_id": "35d340ae-351e-47b4-93c8-96124bb08600", "context": {"group_id": "24703ea7-a07a-4398-bcd0-396d3db5e60a", "group_name": "Baozi", "character_num": 1, "channel_type": "ccs"}, "sender": "f6a8ae7f-0382-40f2-b4db-3237326b9a00"}}
```

Notice the `"content": {"text": "hello world"}` part. This demonstrates that this Message is already sent to your CCS.

:::tip
The SDK uses `loguru` for logging. Logs are not only printed to console, but saved in the `log` directory under your working directory (which can be automatically created). Using a logging system instead of `print()` is considered a more graceful approach, especially if you want to build something serious instead of a toy. The logging behavior to both the consol and disk can be modified by changing config/log.json You can add your own logs anywhere in your program with calls like `logger.info("Your log")`, after you make `from loguru import logger` statement at the beginning of your code file. For detailed usages of `loguru`, please refer to [GitHub - Delgan/loguru: Python logging made (stupidly) simple](https://github.com/Delgan/loguru).
:::

Congratulations! You are officially a Moobius Developer now, and let's explore the wonderful world of GBA!

:::tip
Our tutorial assumes you have basic knowledge and experience of the Python programming language, including asynchronous programming https://docs.python.org/3/library/asyncio-task.html (`async`/`await`). Don't worry if you are not familiar with the entire field of event loops, coroutines, tasks and futures, since this Basic Tutorial requires almost nothing more than of the basic usage of `async` and `await` keywords. In a word, if a function is defined as asynchronous (using `async def` instead of `def`), you should call it only inside another `async` function, and use `await` before your call statement (this principle is not strictly true but enough for this tutorial).
:::

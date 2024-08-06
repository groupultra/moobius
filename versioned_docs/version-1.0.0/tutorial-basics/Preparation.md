---
id: Preparation
hide_table_of_contents: true
---

import DocsCard from '../../../src/components/global/DocsCard';
import DocsCards from '../../../src/components/global/DocsCards';

This section will give you a step-to-step guide on how to develop a CCS with our Python SDK and build your first GBA. All you need is a computer with Internet access and Python (3.10+) installed.

You can only apply CCS to Channels you created (of course, you won't like others to take over your Channel either). For you to create a Channel on Moobius and develop a CCS behind it, you have to register a User account on Moobius (www.moobius.net/register) with an email and a password. For now, we don't support third-party login Users to create CCS (however they can use CCS created by others as a common User).

After you register your Moobius account, log in to Moobius, change your name and avatar, and click the "Create Channel" button on the left. You are prompted to create a Channel for your GBA. After you create the Channel, you automatically joined the Channel, and you are the only User in that Channel.

The most important thing of a Channel, at least for development purpose, is its Channel ID. The Channel ID is the unique identifier of a Channel on Moobius, and Users could join the Channel if they know the Channel ID. You can write down the Channel ID displayed in the prompt after you create a Channel, or click the icon next to the Channel title after you join the Channel.

:::tip
Alternatively, if you are using a web browser to visit Moobius, the Channel ID would appear in your URL bar when you are in a specific channel. For example, the Channel ID for https://www.moobius.net/channels/229e6c38-39fb-40b6-9a9a-0f5b0182de85 is 229e6c38-39fb-40b6-9a9a-0f5b0182de85.
:::

Once you finished setting up your Channel, you can begin programming your CCS. It is recommended that you keep your Channel tab open, since you may want to test and debug your CCS in your browser. Your will soon find out that the CCS is light-weight: once you modify the code of your CCS, all you need to do is to restart the program, and the behavior of the Channel will be updated. This will facilitate agile development and prompt feedback loop from your Users (Remember, your Users is somehow part of your GBA!)

Our team is maintaining an official version of Python SDK for Moobius (https://github.com/groupultra/sdk-public), which is fully open-source, and we will use that for all the demos. We also have a JavaScript SDK available (https://www.npmjs.com/package/moobius), but currently it is only for frontend (Agent) and not suitable for CCS. You are welcome to contribute SDKs in your own favorite language based on our (language-agnostic) HTTPS and Websocket APIs (link).

:::tip
Moobius is an open platform, in the sense that all our APIs, SDKs, and communication protocols are open-source and you can access and use them free of charge. Any third-party integration is encouraged, and you are free to modify the frontend client with our Agent SDK for your own new product. We know openness is paramount to the developer community, so that we won't let this core value be jeopardized even if we are to commercialize.
:::

To verify you have Python installed, type the following command on your command-line console (Windows cmd, Mac Terminal or Linux Shell, etc), and press Enter:

```shell
python --version
```

It should show the version number of your default Python Interpreter. If it is lower than 3.10, or prints out some errors, you should install a new version of Python from www.python.org.

:::note
A typical inconvenience with some machines is that you need to use python3 instead of python in command line. If the above command does not work, try using the following one (and similarly, all other ones with python) before moving to the next possible solution.
:::

```shell
python3 --version
```

Next, run the following command:

```shell
pip install moobius
```

This will automatically install the Python SDK for Moobius on your computer. If you previously has moobius package installed, please use

```shell
pip install moobius --upgrade
```

:::tip
You may want to install the package in a virtual environment, which is the recommended practice for Python development. For details on venv, please refer to https://docs.python.org/3/library/venv.html.
:::

:::tip
On some Linux cloud instances, pip itself may not be installed along with Python. To install pip, try something like
:::

```shell
sudo apt-get update
sudo apt-get install python3-pip
```

Once you have a Moobius account, a Channel on your own and the SDK installed, you are officially ready for becoming a Moobius developer. Welcome to our community! If you have any issues or feedback during your development process (including learning this tutorial), you are free to let us know in our Discord "channel" [link] (no, it is not even close to a Moobius Channel, but for now we have to use an alternative way for communication), and our team will try our best to answer to your calls.

<!-- <DocsCards>
    <DocsCard header="Run Demo" href="/tutorial-basics/Run Demo" img="/icons/feature-component-actionsheet-icon.png"></DocsCard>
    <DocsCard header="Characters" href="/tutorial-basics/Characters" img="/icons/feature-component-actionsheet-icon.png"> </DocsCard>
    <DocsCard header="Messages" href="/tutorial-basics/Messages" img="/icons/feature-component-actionsheet-icon.png"></DocsCard>
    <DocsCard header="Canvas, Button and Context Menu" href="/tutorial-basics/Canvas, Button and Context Menu" img="/icons/feature-component-actionsheet-icon.png"></DocsCard>
    <DocsCard header="Miscellaneous Actions" href="/tutorial-basics/Miscellaneous Actions" img="/icons/feature-component-actionsheet-icon.png"></DocsCard>
    <DocsCard header="Life Cycle" href="/tutorial-basics/Life Cycle" img="/icons/feature-component-actionsheet-icon.png"></DocsCard>
</DocsCards> -->

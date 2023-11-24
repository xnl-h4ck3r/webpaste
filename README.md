<center><img src="https://github.com/xnl-h4ck3r/webpaste/blob/main/images/title.png"></center>

## About - v2.0

Where is v1.0 you might say?! If you aren't aware of `webpaste` already, it is a tool by [@TomNomNom](https://twitter.com/tomnomnom) that can be found [here](https://github.com/tomnomnom/hacks/tree/master/webpaste).

This is just a upgraded version to add a few extra options and give this great tool a bit of ♥️

### What does it do?

In a nutshell, it can save your dorking results to the terminal.

You can go to a site such as Google, Shodan, Security Trails, etc. and then click on a button to send information you want, such as endpoints, to your terminal. For example, you can go to Google and look for `site:target.com` and then click a button for Google on the extension, and all the endpoints magically appear on your terminal, and get written to a file. This is done by entering a javascript **snippet** to get the endpoints, and then optionally another javascript **post snippet** to click the next page button for example. So then you can just keep clicking away and watch the site go from page to page and get all the endpoints. This is useful for sites that don't have an API.

### What's different in version 2?

The main differences are:

- The output will also be written to a file, and the user can specify the file name.
- The output will be unique and sorted by default, but you have an option of keep duplicates if you wish.
- It defaults to running on localhost on port 8082. Why 8082 instead of 8080? Well, most people using this tool will probably have Burp Suite running on 8080, and I also use 8081 for proxying to Burp from my VPS.
- Include a default snippets for Google and Bing that work at the time of writing this.
- Improved error messages.
- Fixed some UI issues.
- Actively maintained (while Chrome allows it to work!).

## Installing

### CLI Tool

1. Run `git clone https://github.com/xnl-h4ck3r/webpaste/`
2. Run `go build -o webpaste main.go` to build the `webpaste` binary.
3. Before starting `webpaste`, set the environment variable `WEBPASTE_TOKEN`, e.g. `export WEBPASTE_TOKEN=ilovetomnomnom`

### Chrome Extension

1. Open the Extension Manager in Chrome by following:
   Kebab menu(three vertical dots) -> Extensions -> Manage Extensions

2. If the developer mode is not turned on, turn it on by clicking the toggle in the top right corner.

3. Now click on **Load unpacked** button on the top left

4. Go the directory where you have the `webpaste/chrome` folder and select it.

5. The extension is now loaded. You can click on the extension icon in the toolbar, and then the pin icon to pin `webpaste` to your toolbar.

**IMPORTANT:**
When you load the Chrome extension you will see the following error:

**Manifest version 2 is deprecated, and support will be removed in 2023. See https://developer.chrome.com/blog/mv2-transition/ for more details.**

Google say that from January 2023 the Chrome browser will no longer run Manifest V2 extensions. That's obviously not true because it still runs, but for how long I don't know. Unfortunately this extension can't be upgraded to Manifest V3 because it has tighter security that prevents the requests being sent to the local server running on the terminal.

### Why no Firefox extension?

You have to use Manifest V3 for Firefox now. As mentioned above, this extension can't be upgraded to Manifest V3 with the way it works currently.

## Usage

### Chrome Extension

Open the extension **Options** page

1. Enter the Server and port. e.g. `http://localhost:8082`
2. Enter the Token with the value you used for the environment variable above, e.g. `ilovetomnomnom`
3. Click the **Save** button

You can then optionally add more javascript snippets by clicking the **Add Snippet** button.

### CLI Tool

These are the options available when calling `webpaste`

```
  -o string
    	output file name (default "webpaste.txt")
  -h string
        address to listen on (default "localhost")
  -p string
    	port to listen on (default "8082")
  -d	don't sort and de-duplicate output
```

For example, start `webpaste` to write the output to a file:

```
./webpaste -o target_endpoints.txt
```

### Getting results

Using the example **Google URLs** snippet that is included by default:

1. Open google and search for something like `site:redbull.com`
2. Make sure `wepaste` is running in the terminal and there are no errors, and it says it is listening.
3. Click on `webpaste` extension and click on `Google URLs`, and you will see URLs from the google search engine in your terminal. The **post snippet** will also load the next set of results (e.g. click the **More results** button).
4. Keep pressing the `Google URLs` and get links. At some point Google will probably show you a Captcha screen. Just complete it and carry on clicking!

**IMPORTANT: Any examples provided work at the time of writing this, but if the target changes their site, you may need to change the javascript snippet to work again.**

## Issues

If you come across any problems at all, or have ideas for improvements, please feel free to raise an issue on Github. If there is a problem, it will be useful if you can provide the exact URL you were on, and any console errors.
<br><br>
Good luck and good hunting!
If you really love the tool (or any others), or they helped you find an awesome bounty, consider [BUYING ME A COFFEE!](https://ko-fi.com/xnlh4ck3r) ☕ (I could use the caffeine!)

🤘 /XNL-h4ck3r

<center><img src="https://github.com/xnl-h4ck3r/webpaste/blob/main/images/options.png"></center>

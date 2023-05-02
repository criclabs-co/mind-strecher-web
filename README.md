# mind-strecher-web

## Usage

1. Include following script tag to page head in the site setting or specific page.
2. Update `tag-version` and `path-to-module` of the module to include.
3. Make sure to add all the dependencies in a script tag before adding the module you want to use. You can find the required dependencies listed at the top of the module's source code.

```html
<script
  defer
  src="https://cdn.jsdelivr.net/gh/criclabs-co/mind-strecher-web@{tag-version}/src/{path-to-module}"
></script>
```

## Local Development

The following instructions for setting up a local development environment allow you to develop the web component locally and see the changes you make reflected on the Webflow site.

### Prerequisites

1. Install [ngrok](https://ngrok.com/download) on your local machine.
2. Sign in to ngrok and configure your authentication token on your machine.

```sh
ngrok config add-authtoken YOUR-AUTH-TOKRN
```

### Setup Local Development

1. Run the ngrok's file server with following command:

```sh
ngrok http file://$PWD
```

2. Get the public URL from the ngrok console and visit the URL from your browser then click on "Visit Site".
3. On the WebFlow's custom code setting, comment out the script tag of the original module and add the module you are working on.

```html
<!-- <script defer src="ORIGINAL_MODULE_URL/src/components/Button/index.js"></script> -->
<script defer src="NGROK_PUBLIC_URL/src/components/Button/index.js"></script>
<script>
  console.log("Using development version of Button");
</script>
```

**Note:** For better clarity, it's recommended to include a notice in the console log that the module is under development.

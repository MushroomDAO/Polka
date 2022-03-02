#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui/App";
import { PubsubProvider } from "./ui/contexts/PubsubProvider";

const cli = meow(
	`
  Usage
    $ polka <frequency>   // the channel you want to connect to. Can be anything.
    $ polka --version
    $ polka --help
  

  Examples
    $ polka russia
    $ polka               // Will connect you to our default channel #polka
    $ polka --version
`
);

render(
	<PubsubProvider>
		<App frequency={cli.input[0] || "polka"} />
	</PubsubProvider>
);

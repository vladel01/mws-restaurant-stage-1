# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview

For the **Restaurant Reviews** project, I was incrementally convert a static webpage to a mobile-ready web application.

In **Stage One**, a static design that lacks accessibility was took and convert the design to be responsive on different sized displays and accessible for screen reader use. Also was needed to add a service worker to begin the process of creating a seamless offline experience for users.

 In **Stage Two**, the responsive, accessible design built in Stage One was connected to an external server. Asynchronous JavaScript to request JSON data from the server was added. It had to store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, some work was needed to optimize site to meet performance benchmarks, which it was tested using Lighthouse.

 In **Stage Three**, in the connected application built in Stage One and Stage Two, additional functionality was added. A form to allow users to create their own reviews was added. If the app is offline, the form will defer updating to the remote database until a connection is established. Finally, more work to optimize the site to meet even stricter performance (>90) benchmarks than the previous project, and test again using Lighthouse was neede.

### Installation:
- install NodeJS with npm
- install the dependencies: npm install
- Grunt is used for its responsive images plugin.
- In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.
- The Local Development API Server is located on: https://github.com/vladel01/mws-restaurant-stage-3 - use instructions to set it up.
- Launch the app in browser. Chrome is recommended because most of the code in this project has been written to the ES6 JavaScript and no compiler was used. Also, Fetch API and other technologies unsupported by all the browsers were used.


### Testing:
After visiting a restaurant from the list, you can disable network connectivity to test offline side of the app.
You can submit reviews by filling the form within restaurant page and after you enable network you can observe the review being sent to the server.

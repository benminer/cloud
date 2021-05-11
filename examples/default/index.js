"use strict";

/*
  The @serverless/cloud package is included by default in the cloud runtime.
  So you don't have to include it in package.json.
*/
const { api, data, schedule } = require("@serverless/cloud"); // eslint-disable-line

/*
  The @serverless/data package gives easy access to Serverless Data.
  It is also included by default in the cloud runtime, so you don't
  have to include it in package.json either.
*/

/*
  This route creates/updates an item in Serverless Data using the supplied
  "key" and uses the post body to set the value. 
*/
api.post("/data/:key", async (req, res, next) => {
  try {
    const key = req.params.key;

    if (!key) {
      throw new Error('Missing "key" or "value" params.');
    }

    console.log(`Setting "${key}"`);

    // Just run the .set method to set an item to Serverless Data
    await data.set(key, req.body);

    res.send({ message: `Successfully set key "${key}"` });
  } catch (e) {
    next(e);
  }
});

/*
  This route fetches data from Serverless Data using the provided "key".
*/
api.get("/data/:key", async (req, res, next) => {
  try {
    const key = req.params.key;
    const reverse = req.query.reverse === "true" || false;

    if (!key) {
      throw new Error('Missing "key" param.');
    }

    console.log(`Getting "${key}"`);

    // Just run the .get method to get an item by its key
    const value = await data.get(key, { reverse });

    // Return the value if it exists
    res.send(value || {});
  } catch (e) {
    next(e);
  }
});

/*
  This route deletes data from Serverless Data using the provided "key".
*/
api.delete("/data/:key", async (req, res, next) => {
  try {
    const key = req.params.key;

    if (!key) {
      throw new Error('Missing "key" param.');
    }

    console.log(`Deleting "${key}"`);

    // Run the .remove() method to delete an item by key
    const result = await data.remove(key);

    // Return the value
    res.send({ deleted: result });
  } catch (e) {
    next(e);
  }
});

/*
  This is some custom error handler middleware
*/
// eslint-disable-next-line
api.use((err, req, res, next) => {
  // Errors are also streamed live to your terminal in dev mode.
  console.error(err.stack);

  if (!err.statusCode) {
    err.statusCode = 500;
  }

  const error = {
    name: err.name,
    statusCode: err.statusCode,
    message: err.message,
  };

  res.status(err.statusCode).json(error);
});

/*
  Sometimes you might want to run code on a schedule. 
*/
schedule.rate("1 hour", () => {
  // This code block will run every hour!
  console.log("Run schedule!");
});
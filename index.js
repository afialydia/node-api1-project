// import express from 'express'; // ES Modules
// in Node.js we'll import files using this syntax
const express = require("express"); // CommonJS Modules

const db = require("./data/db.js"); // <<<<< 1: import the database file

const server = express();

server.use(express.json()); // <<<<<<<<<<<<<<<<<  needed to parse JSON from the body

server.get("/api/", (req, res) => {
	res.send({ api: "up and running..." });
});

// list of users GET /users <<< 2: implement endpoint
server.get("/api/users", (req, res) => {
	// get the list of hubs from the database
	db.find()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(error => {
			console.log("error on GET /api/users", error);
			res
				.status(500)
				.json({ errorMessage: "error getting list of users from database" });
		});
});

// add a user
server.post("/api/users", (req, res) => {
	// get the data the client sent
	const userData = req.body; // express does not know how to parse JSON

	// call the db and add the hub
	db.insert(userData)
		.then(user => {
            if (!userData.name || !userData.bio ) {
				res
					.status(400)
					.json({ errorMessage: "Please provide name and bio for the user." });
			} else {
				res.status(201).json({ message: 'user created',userData});
			}
		})
		.catch(error => {
			console.log("error on POST /api/users", error);
			res
				.status(500)
				.json({
					error: "There was an error while saving the user to the database"
				});
		});
});

server.get("/api/users/:id", (req, res) => {
	const id = req.params.id;

	db.findById(id)
		.then(user => {
			if(user){res.status(200).json({message: 'user found', user});
		}else{        res.status(404).json({ message: "user not found" });
    }})
		.catch(error => {
			console.log("error on GET /api/users", error);
			res
				.status(500)
				.json({ errorMessage: "The user information could not be retrieved." });
		});
});

// remove a hub by it's id
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(200).json({ message: "user removed successfully", removed });
      } else {
        // there was no hub with that id
        res.status(404).json({  message: "The user with the specified ID does not exist."  });
      }
    })
    .catch(error => {
      console.log("error on DELETE /api/users/:id", error);
      res.status(500).json({ errorMessage: "error removing the hub" });
    });
});

server.put("/api/users/:id", (req, res) => {
const id = req.params.id
const body = req.body

if(!(body.name && body.bio)){
	res.status(500).json({errorMessage: 'Please provide name and bio for the user'})
}else{
	db.update(id,body)
		.then(user => {
			if(user){res.status(200).json({message: 'user updated', user});
		}else{        res.status(404).json({ message: "The user with the specified ID does not exist."});
    }})
		.catch(error => {
			console.log("error on GET /api/users", error);
			res
				.status(500)
				.json({ errorMessage: "The user information could not be retrieved." });
		});
}})


// update a hub, passsing the id and the changes

const port = 4600;
server.listen(port, () =>
	console.log(`\n ** API running on port ${port} **\n`)
);

# Real-Time Chat Website with MERN Stack, Socket.io, Redux Toolkit, and Material UI

This is a real-time chat website that allows users to connect with each other and chat in real-time. It was built using the MERN stack (MongoDB, Express.js, React.js, and Node.js), Socket.io, Redux Toolkit, and MUI. 

## Configuration and Setup
In order to run this project locally, simply fork and clone the repository or download as zip and unzip on your machine.

- Open the project in your prefered code editor.
- Go to terminal -> New terminal (If you are using VS code)
- Split your terminal into two (run the client on one terminal and the server on the other terminal)

In the first terminal
- cd client and create a .env file (if not exist) in the root of your client directory.
- Supply the following credentials

```
REACT_APP_SERVER_URL='http://localhost:8000'
```

$ cd client
$ npm install (to install client-side dependencies)
$ npm start (to start the client)
```
In the second terminal
- cd server and create a .env file (if not exist) in the root of your server directory.
- Supply the following credentials

```
PORT=8000
DB_URL=
SECRET=
CLIENT_ID=
BASE_URL="http://localhost:3000"
```
```
$ cd server
$ npm install (to install server-side dependencies)
& npm start (to start the server)


## Contributing

Contributions to this project are welcome! If you find a bug or want to add a feature, please submit an issue or a pull request. To contribute, follow these steps:

1. Fork the repository
2. Create a new branch for your feature: `git checkout -b my-new-feature`
3. Make changes and commit them: `git commit -m 'Add some feature'`
4. Push your branch to your forked repository: `git push origin my-new-feature`
5. Create a Pull Request
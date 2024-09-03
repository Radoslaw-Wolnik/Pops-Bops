# Pops-Bops

a full stack app to press on buttons with sounds

This project can be run in two modes: Docker containers mode and Docker Swarm mode. Before starting the project, you need to set up local secrets.

## Prerequisites

- Docker
- Docker Compose
- Docker Swarm (for swarm mode)

## Setting Up the Project

1. Clone the repository
2. Navigate to the scripts directory: `cd scripts`
3. Set executable permissions: `./set_permissions.sh`
4. Set up local secrets: 
   - Copy `local_secrets.sh.example` to `local_secrets.sh`
   - Edit `local_secrets.sh` with your actual email credentials
5. Generate secrets: `./generate_secrets.sh`
6. Start the project: `./start_project.sh`

Note: `local_secrets.sh` is ignored by Git to prevent accidental commit of sensitive information.

set local local_secrets.sh and all scripts in ./scripts to be executable
chmod +x ./name.sh
chmod +x set_permissions.sh
./set_permissions.sh





## Setup

### 1. Set up local secrets

#### For running in the containers mode
1. Copy the example .env file:
   ```
   cp .example.env .env
   ```

2. Edit `.env` and fill in your actual values.

#### For running in the swarm mode
Before starting the project, you need to create local secrets based on the example file:

1. Navigate to the scripts directory:
   ```
   cd root/scripts
   ```

2. Copy the example secrets file:
   ```
   cp local-secrets.sh.example local-secrets.sh
   ```

3. Edit `local-secrets.sh` and fill in your actual secret values.

4. Run the local secrets script to create the secrets:
   ```
   ./local-secrets.sh
   ```


### 2. Choose a mode to run the project

#### A. Docker Containers Mode

To start the project in Docker containers mode:

```
./scripts/start-containers.sh --dev
```

This will build the necessary Docker images and start the containers defined in `docker-compose-containers.yml`.

To stop the containers:

```
./scripts/stop-containers.sh
```

#### B. Docker Swarm Mode

To start the project in Docker Swarm mode:

```
./scripts/start-swarm.sh --dev
```

This will initialize a Docker Swarm (if not already initialized), deploy the stack defined in `docker-compose-swarm.yml`, and start the services.

To stop the swarm services and leave the swarm:

```
./scripts/stop-swarm.sh
```

## Choosing Between Containers and Swarm Mode

- **Container Mode**: Ideal for local development and testing. It's simpler to set up and manage for single-machine deployments.

- **Swarm Mode**: Better for production-like environments, multi-node deployments, and when you need features like rolling updates and service scaling.

## Additional Notes

- The `--dev` flag starts the project in development mode. Use `--prod` for production mode.
- Make sure to never commit `local-secrets.sh` to version control. It's listed in `.gitignore` for your safety.
- Always check the logs (in the `logs` directory) if you encounter any issues during startup.

For more detailed information about each service, refer to their respective README files in their directories.


## So now - TODO
- [ ] set resource limits (docker swarm mode)
- [x] make helth checks (mongo)
- [ ] consider lazy load for pictures/music files

- [x] redesigned entire backend
- [x] restructure middleware/utils in backend
- [x] the api documentation
- [ ] make scheduler for cleanupFunction for revoked tokens

- [x] create admin acc (in populate db script)
- [ ] make populate db script so that there is admin account that can add bops but also so that there are things in db to begin with (bops on main page, icons etc)
- [ ] add some (5) sounds and icons (in populate)

- [ ] create svg titles
- [ ] create homepage with title and bops, pops
- [ ] create make pop bop with simple icon creator (make it pop)
- [ ] create my pops

- [ ] add request password reset to the login modal
- [ ] only request token reset if there is a token to begin with; start token refresh counter after login not after rendering the website

- [ ] create collections
- [ ] add to collections
- [ ] custom font for collections

- [ ] loading spinner
- [ ] styles for login singup
- [ ] mini icon maker canva for bops (make it pop page)


- [x] make usage of docker secrets
- [ ] make swarm work


Set resource limits:
Add resource limits to your services to prevent any single container from consuming all available resources:
yaml
services:
  mongo:
    ...
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M

Enable health checks:
Add health checks to ensure your services are running correctly:
services:
  mongo:
    ...
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5


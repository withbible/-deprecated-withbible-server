# ELK

## Setup
- Install `Ubuntu` >  `JDK`.

- Check [Right OS version](https://www.elastic.co/kr/support/matrix).

- Download [ELK](https://www.elastic.co/kr/downloads/).

### Only the first time

```bash
# Install at admin
sudo apt install <service.name>

# Set service command
sudo systemctl enable <service name>.service
```

### Everytime

```bash
# Run the Service
sudo service <service name> start / stop
```

## Check Localserver status (options)

```bash
# Install at admin (only the first time)
apt install net-tools

# Check
netstat -tnlp
```

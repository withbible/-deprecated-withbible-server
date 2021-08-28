# ELK

## Setup

- `ubuntu` 환경에 `JDK8` 수동설치.

- Check [본인 os에 맞는 버전 찾기](https://www.elastic.co/kr/support/matrix).

- Download [ELK](https://www.elastic.co/kr/downloads/).

### Only the first time

```bash
# Install at admin
sudo dpkg -i <file>

# Set service command
sudo systemctl enable <service name>.service

# Aware logstash service (WSL issue)
/usr/share/logstash/bin/system-install /etc/logstash/startup.options sysv
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

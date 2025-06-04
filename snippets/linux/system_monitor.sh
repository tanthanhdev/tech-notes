#!/bin/bash
#
# System Monitoring Script
# This script collects and displays system information
#

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}==== $1 ====${NC}"
}

# Function to print success/warning/error messages
print_status() {
    if [ "$2" == "ok" ]; then
        echo -e "${GREEN}$1${NC}"
    elif [ "$2" == "warning" ]; then
        echo -e "${YELLOW}$1${NC}"
    else
        echo -e "${RED}$1${NC}"
    fi
}

# Check if script is run as root
if [ "$EUID" -ne 0 ]; then
    print_status "Warning: This script should be run as root for full functionality" "warning"
fi

# System Information
print_header "System Information"
echo "Hostname: $(hostname)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo "Last Boot: $(who -b | awk '{print $3, $4}')"

# CPU Information
print_header "CPU Information"
cpu_model=$(grep "model name" /proc/cpuinfo | head -n 1 | cut -d ':' -f 2 | sed 's/^[ \t]*//')
cpu_cores=$(grep -c "processor" /proc/cpuinfo)
cpu_load=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | sed 's/^[ \t]*//')

echo "CPU Model: $cpu_model"
echo "CPU Cores: $cpu_cores"
echo -n "CPU Load: $cpu_load "

# Check CPU load
cpu_load_float=$(echo $cpu_load | sed 's/,/./g')
if (( $(echo "$cpu_load_float < 1" | bc -l) )); then
    print_status "(Normal)" "ok"
elif (( $(echo "$cpu_load_float < 2" | bc -l) )); then
    print_status "(Moderate)" "warning"
else
    print_status "(High)" "error"
fi

# Memory Information
print_header "Memory Information"
total_mem=$(free -h | grep "Mem:" | awk '{print $2}')
used_mem=$(free -h | grep "Mem:" | awk '{print $3}')
free_mem=$(free -h | grep "Mem:" | awk '{print $4}')
mem_usage_percent=$(free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)

echo "Total Memory: $total_mem"
echo "Used Memory: $used_mem"
echo "Free Memory: $free_mem"
echo -n "Memory Usage: $mem_usage_percent% "

# Check memory usage
if [ "$mem_usage_percent" -lt 70 ]; then
    print_status "(Normal)" "ok"
elif [ "$mem_usage_percent" -lt 85 ]; then
    print_status "(Moderate)" "warning"
else
    print_status "(High)" "error"
fi

# Disk Usage
print_header "Disk Usage"
echo "Filesystem      Size  Used  Avail  Use%  Mounted on"
df -h | grep -v "tmpfs" | grep -v "udev" | grep -v "loop" | tail -n +2 | while read line; do
    usage_percent=$(echo $line | awk '{print $5}' | sed 's/%//')
    if [ "$usage_percent" -lt 70 ]; then
        status="ok"
    elif [ "$usage_percent" -lt 85 ]; then
        status="warning"
    else
        status="error"
    fi

    filesystem=$(echo $line | awk '{print $1}')
    size=$(echo $line | awk '{print $2}')
    used=$(echo $line | awk '{print $3}')
    avail=$(echo $line | awk '{print $4}')
    use_percent=$(echo $line | awk '{print $5}')
    mounted=$(echo $line | awk '{print $6}')

    printf "%-15s %-5s %-5s %-6s " "$filesystem" "$size" "$used" "$avail"
    print_status "$use_percent" "$status"
    echo "  $mounted"
done

# Network Information
print_header "Network Information"
echo "Interface    IP Address         MAC Address        Status"
ip -o addr show | grep 'inet ' | grep -v '127.0.0.1' | while read line; do
    interface=$(echo $line | awk '{print $2}')
    ip_address=$(echo $line | awk '{print $4}')
    mac_address=$(ip link show $interface | grep link/ether | awk '{print $2}')
    status=$(ip link show $interface | grep -o "state [A-Z]*" | cut -d ' ' -f 2)

    printf "%-12s %-18s %-18s " "$interface" "$ip_address" "$mac_address"
    if [ "$status" == "UP" ]; then
        print_status "$status" "ok"
    else
        print_status "$status" "error"
    fi
done

# Process Information
print_header "Top 5 CPU-Consuming Processes"
ps aux --sort=-%cpu | head -6

print_header "Top 5 Memory-Consuming Processes"
ps aux --sort=-%mem | head -6

# System Load
print_header "System Load Average (1, 5, 15 min)"
load_avg=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
echo $load_avg

# Check for failed services
print_header "Failed Services"
if command -v systemctl &> /dev/null; then
    failed_services=$(systemctl --failed | grep "failed" | wc -l)
    if [ "$failed_services" -eq 0 ]; then
        print_status "No failed services found" "ok"
    else
        print_status "$failed_services failed services found:" "error"
        systemctl --failed | grep "failed"
    fi
else
    echo "systemctl not found, skipping service check"
fi

# Check for system updates
print_header "System Updates"
if command -v apt &> /dev/null; then
    # Debian/Ubuntu
    updates=$(apt list --upgradable 2>/dev/null | grep -v "Listing..." | wc -l)
    if [ "$updates" -eq 0 ]; then
        print_status "System is up to date" "ok"
    else
        print_status "$updates updates available" "warning"
    fi
elif command -v yum &> /dev/null; then
    # CentOS/RHEL
    updates=$(yum check-update --quiet | grep -v "^$" | wc -l)
    if [ "$updates" -eq 0 ]; then
        print_status "System is up to date" "ok"
    else
        print_status "$updates updates available" "warning"
    fi
else
    echo "Package manager not detected, skipping update check"
fi

# Security Checks
print_header "Security Checks"

# Check SSH root login
if [ -f /etc/ssh/sshd_config ]; then
    if grep -q "PermitRootLogin yes" /etc/ssh/sshd_config; then
        print_status "SSH root login is enabled (security risk)" "error"
    else
        print_status "SSH root login is disabled" "ok"
    fi
fi

# Check for listening ports
print_header "Open Ports"
if command -v netstat &> /dev/null; then
    netstat -tuln | grep LISTEN
elif command -v ss &> /dev/null; then
    ss -tuln | grep LISTEN
else
    echo "Neither netstat nor ss found, skipping port check"
fi

# Summary
print_header "System Health Summary"
# Check overall health based on previous checks
if [ "$mem_usage_percent" -lt 85 ] && [ "$failed_services" -eq 0 ]; then
    print_status "System appears to be healthy" "ok"
else
    print_status "System needs attention" "warning"
fi

echo -e "\nReport generated on $(date)"

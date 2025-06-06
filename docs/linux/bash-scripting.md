---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Bash Scripting
description: Guide about Bash Scripting
---
# Bash Scripting

Bash (Bourne Again SHell) is a command language interpreter that is widely used on various operating systems, and is the default shell on most Linux distributions.

## Introduction to Bash Scripting

Bash scripts are text files containing a series of commands that are executed by the Bash shell. They allow you to automate repetitive tasks, combine complex commands, and create custom utilities.

## Basic Syntax

### Creating a Bash Script

1. Create a file with a `.sh` extension
2. Add the shebang line at the top: `#!/bin/bash`
3. Make the script executable: `chmod +x script.sh`
4. Run the script: `./script.sh`

### Hello World Example

```bash
#!/bin/bash
# This is a comment
echo "Hello, World!"
```

## Variables

### Variable Declaration and Usage

```bash
#!/bin/bash

# Variable declaration
name="John"
age=30

# Using variables
echo "Name: $name"
echo "Age: $age"

# Command substitution
current_date=$(date)
echo "Current date: $current_date"

# Arithmetic operations
result=$((10 + 5))
echo "10 + 5 = $result"
```

### Special Variables

| Variable | Description |
|----------|-------------|
| `$0` | The name of the script |
| `$1` to `$9` | The first 9 arguments passed to the script |
| `$#` | The number of arguments passed to the script |
| `$@` | All arguments passed to the script |
| `$?` | The exit status of the last command |
| `$$` | The process ID of the current script |
| `$USER` | The username of the user running the script |
| `$HOSTNAME` | The hostname of the machine |
| `$RANDOM` | A random number |
| `$HOME` | The home directory of the user |

## Control Structures

### Conditional Statements

#### If-Else Statement

```bash
#!/bin/bash

age=25

if [ $age -lt 18 ]; then
    echo "You are a minor."
elif [ $age -ge 18 ] && [ $age -lt 65 ]; then
    echo "You are an adult."
else
    echo "You are a senior."
fi
```

#### Case Statement

```bash
#!/bin/bash

fruit="apple"

case $fruit in
    "apple")
        echo "This is an apple."
        ;;
    "banana")
        echo "This is a banana."
        ;;
    "orange")
        echo "This is an orange."
        ;;
    *)
        echo "Unknown fruit."
        ;;
esac
```

### Loops

#### For Loop

```bash
#!/bin/bash

# Simple for loop
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

# For loop with range
for i in {1..5}; do
    echo "Number: $i"
done

# For loop with step
for i in {1..10..2}; do
    echo "Odd number: $i"
done

# For loop with command output
for file in $(ls); do
    echo "File: $file"
done
```

#### While Loop

```bash
#!/bin/bash

count=1

while [ $count -le 5 ]; do
    echo "Count: $count"
    ((count++))
done
```

#### Until Loop

```bash
#!/bin/bash

count=1

until [ $count -gt 5 ]; do
    echo "Count: $count"
    ((count++))
done
```

## Functions

### Function Definition and Usage

```bash
#!/bin/bash

# Function definition
greet() {
    echo "Hello, $1!"
}

# Function with return value
add() {
    local result=$(($1 + $2))
    echo $result
}

# Function calls
greet "John"
sum=$(add 5 3)
echo "5 + 3 = $sum"
```

## Input and Output

### Reading User Input

```bash
#!/bin/bash

# Read a single value
echo "Enter your name:"
read name
echo "Hello, $name!"

# Read multiple values
echo "Enter your first and last name:"
read first_name last_name
echo "Hello, $first_name $last_name!"

# Read with prompt
read -p "Enter your age: " age
echo "You are $age years old."

# Read password (hidden input)
read -sp "Enter your password: " password
echo -e "\nPassword received."
```

### File Input/Output

```bash
#!/bin/bash

# Writing to a file
echo "Hello, World!" > output.txt
echo "This is a new line." >> output.txt

# Reading from a file
while IFS= read -r line; do
    echo "Line: $line"
done < input.txt

# Process each line of a file
cat input.txt | while read line; do
    echo "Processing: $line"
done
```

## Arrays

### Array Operations

```bash
#!/bin/bash

# Declare an array
fruits=("apple" "banana" "orange" "grape")

# Access array elements
echo "First fruit: ${fruits[0]}"
echo "All fruits: ${fruits[@]}"
echo "Number of fruits: ${#fruits[@]}"

# Iterate through array
for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done

# Add element to array
fruits+=("kiwi")

# Remove element from array
unset fruits[1]
```

## String Manipulation

### String Operations

```bash
#!/bin/bash

# String length
str="Hello, World!"
echo "Length: ${#str}"

# Substring
echo "Substring: ${str:7:5}"

# String replacement
echo "Replace: ${str/World/Bash}"

# Convert to uppercase/lowercase
echo "Uppercase: ${str^^}"
echo "Lowercase: ${str,,}"
```

## Error Handling

### Basic Error Handling

```bash
#!/bin/bash

# Exit on error
set -e

# Custom error handling
handle_error() {
    echo "Error occurred at line $1"
    exit 1
}

# Trap errors
trap 'handle_error $LINENO' ERR

# Check command success
if ! command -v git &> /dev/null; then
    echo "Git is not installed."
    exit 1
fi
```

## Best Practices

1. **Use Shebang**: Always include `#!/bin/bash` at the top of your scripts.
2. **Comments**: Add comments to explain complex logic.
3. **Error Handling**: Implement proper error handling.
4. **Indentation**: Use consistent indentation for readability.
5. **Naming Conventions**: Use descriptive names for variables and functions.
6. **Quoting Variables**: Always quote variables to handle spaces and special characters.
7. **Exit Codes**: Return appropriate exit codes.
8. **Modularity**: Break complex scripts into functions.
9. **Debugging**: Use `set -x` for debugging.
10. **Testing**: Test your scripts with different inputs.

## References

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Bash Guide for Beginners](https://tldp.org/LDP/Bash-Beginners-Guide/html/)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [ShellCheck](https://www.shellcheck.net/) - A shell script analysis tool

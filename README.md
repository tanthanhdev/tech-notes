# Tech Notes Hub – Technical notes & practical code snippets

**All-in-one technical notes & code snippets** — A centralized knowledge base covering design patterns, algorithms, data structures, AWS, and more. Perfect for learning, quick reference, and daily developer use.

📄 This README is also available in other languages:

- 🇻🇳 [Tiếng Việt](README_vi.md)

---

## 📚 Overview

Tech Notes Hub is a curated collection of technical notes and code snippets aimed at helping developers deepen their understanding and speed up coding tasks. This repository covers a wide range of topics including:

* Design Patterns
* Algorithms & Data Structures
* Cloud & AWS Services
* Software Architecture
* System Design
* Best Practices & Tips

and many more.

It's designed to be your go-to resource whether you're preparing for interviews, building projects, or learning new concepts.

## 🚀 Features

* Well-organized notes and examples
* Clear and concise explanations
* Language-agnostic concepts with code snippets in popular languages
* Regularly updated content
* Easy to browse and search

## 📂 Contents

* **Design Patterns:** Singleton, Factory, Observer, Strategy, etc.
* **Algorithms:** Sorting, Searching, Graphs, Dynamic Programming
* **Data Structures:** Arrays, Linked Lists, Trees, Graphs, Hash Tables
* **AWS:** EC2, S3, Lambda, CloudFormation, IAM, and more
* **System Design:** Scalability, Caching, Load Balancing
* **Miscellaneous:** DevOps, CI/CD, Security tips, etc.

## 💡 Why Use Tech Notes Hub?

* Centralized knowledge saves time searching multiple resources
* Clear code snippets make concepts easy to understand and apply
* Great for interview prep and daily coding challenges
* Open source and community-driven — contributions welcome!

## 📖 How to Use

Simply browse the folders or use GitHub's search feature to find the topic or pattern you need. Each note is designed to be self-contained with theory and practical code.

**For a complete table of contents with all available notes and resources, check out the [SUMMARY.md](SUMMARY.md) file.**

### 🐳 Docker Environments

This repository includes Docker configurations for running code snippets in various programming languages. To run a code snippet:

```bash
./docker/run-snippet.sh snippets/path/to/your/snippet.py
```

For more information on Docker usage, see the [Docker README](docker/README.md).

### 🛠️ Utilities

This repository contains utility scripts in the `/tools` directory to help maintain the documentation.

#### Updating Markdown Frontmatter

The `update-frontmatter.js` script automatically updates metadata in Markdown files:

```bash
# First, install Node.js dependencies
npm install

# Run the script (updates all Markdown files)
node tools/update-frontmatter.js

# Update a specific file
node tools/update-frontmatter.js algorithms/sorting-algorithms.md
```

#### Generating Table of Contents

The `generate_summary.py` script automatically creates the SUMMARY.md file:

```bash
# Run the script to generate a new table of contents
python tools/generate_summary.py
```

For more information about available tools, see the [Tools README](tools/README.md).

## 🤝 Contribution

Contributions are highly welcome! If you want to:

* Add new notes or code snippets
* Improve existing explanations or examples
* Report issues or suggest new topics

Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

Before submitting a pull request, make sure to check the [Pull Request Rules](PULL_REQUEST_RULES.md) to see what's allowed. ✅

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details.

## 📝 Changelog

For a detailed list of all notable changes to this project, please see the [changelog](changelog.md) file.

## 🙌 Acknowledgements

Thanks to all contributors and the open source community for making this knowledge base better every day.

## 📬 Contact

If you have any questions or suggestions, feel free to open an issue or contact the maintainer:

* GitHub: [tanthanhdev](https://github.com/tanthanhdev)

---

**Happy coding!** 🚀

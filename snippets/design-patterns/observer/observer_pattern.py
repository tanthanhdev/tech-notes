#!/usr/bin/env python3
"""
Observer Pattern Implementation in Python

This example demonstrates a news publisher system where subscribers
can register to receive updates when new articles are published.
"""

from abc import ABC, abstractmethod
from typing import List


# Observer interface
class Observer(ABC):
    """
    The Observer interface declares the update method, used by subjects
    to notify observers of changes.
    """
    @abstractmethod
    def update(self, subject) -> None:
        """
        Receive update from subject.
        """
        pass


# Subject interface
class Subject(ABC):
    """
    The Subject interface declares methods for managing observers.
    """
    @abstractmethod
    def attach(self, observer: Observer) -> None:
        """
        Attach an observer to the subject.
        """
        pass

    @abstractmethod
    def detach(self, observer: Observer) -> None:
        """
        Detach an observer from the subject.
        """
        pass

    @abstractmethod
    def notify(self) -> None:
        """
        Notify all observers about an event.
        """
        pass


# Concrete Subject
class NewsPublisher(Subject):
    """
    The NewsPublisher maintains a list of observers and sends notifications
    when a new article is published.
    """
    def __init__(self):
        self._observers: List[Observer] = []
        self._latest_article: dict = {}
        self._articles: List[dict] = []

    def attach(self, observer: Observer) -> None:
        print(f"NewsPublisher: Attached an observer.")
        self._observers.append(observer)

    def detach(self, observer: Observer) -> None:
        print(f"NewsPublisher: Detached an observer.")
        self._observers.remove(observer)

    def notify(self) -> None:
        """
        Trigger an update in each subscriber.
        """
        print("NewsPublisher: Notifying observers...")
        for observer in self._observers:
            observer.update(self)

    def publish_article(self, title: str, content: str, category: str) -> None:
        """
        Publishes a new article and notifies observers.
        """
        article = {
            "title": title,
            "content": content,
            "category": category
        }
        self._latest_article = article
        self._articles.append(article)
        print(f"NewsPublisher: Published new article - '{title}'")
        self.notify()

    @property
    def latest_article(self) -> dict:
        """
        Returns the latest published article.
        """
        return self._latest_article

    @property
    def articles(self) -> List[dict]:
        """
        Returns all articles.
        """
        return self._articles


# Concrete Observer
class NewsSubscriber(Observer):
    """
    Concrete Observers react to the updates issued by the NewsPublisher
    they are attached to.
    """
    def __init__(self, name: str, categories: List[str] = None):
        self.name = name
        self.categories = categories or []  # Categories the subscriber is interested in

    def update(self, subject: Subject) -> None:
        """
        Receive update from publisher and print the latest article
        if it matches the subscriber's interests.
        """
        if not isinstance(subject, NewsPublisher):
            return

        latest = subject.latest_article
        
        # If subscriber has category preferences and the article category matches
        if not self.categories or latest.get("category") in self.categories:
            print(f"\n{self.name} received news alert:")
            print(f"Title: {latest.get('title')}")
            print(f"Category: {latest.get('category')}")
            print(f"Content snippet: {latest.get('content')[:50]}...")
        else:
            print(f"\n{self.name} ignored article in category '{latest.get('category')}' (not subscribed)")

    def subscribe_to_category(self, category: str) -> None:
        """
        Add a category to subscriber's interests.
        """
        if category not in self.categories:
            self.categories.append(category)
            print(f"{self.name} subscribed to category: {category}")

    def unsubscribe_from_category(self, category: str) -> None:
        """
        Remove a category from subscriber's interests.
        """
        if category in self.categories:
            self.categories.remove(category)
            print(f"{self.name} unsubscribed from category: {category}")


# Specialized Concrete Observer
class PremiumSubscriber(NewsSubscriber):
    """
    A premium subscriber gets more detailed notifications.
    """
    def update(self, subject: Subject) -> None:
        """
        Premium subscribers receive full content regardless of category.
        """
        if not isinstance(subject, NewsPublisher):
            return

        latest = subject.latest_article
        print(f"\n[PREMIUM] {self.name} received breaking news:")
        print(f"Title: {latest.get('title')}")
        print(f"Category: {latest.get('category')}")
        print(f"Full content: {latest.get('content')}")


def main():
    """
    The client code.
    """
    # Create publisher
    news_publisher = NewsPublisher()

    # Create subscribers
    john = NewsSubscriber("John", ["politics", "technology"])
    lisa = NewsSubscriber("Lisa", ["entertainment", "sports"])
    mike = PremiumSubscriber("Mike")  # Premium subscriber gets all categories

    # Attach subscribers to publisher
    news_publisher.attach(john)
    news_publisher.attach(lisa)
    news_publisher.attach(mike)

    # Publish articles
    print("\n--- First Article ---")
    news_publisher.publish_article(
        "New AI Breakthrough",
        "Researchers have developed a new AI model that can understand complex human emotions.",
        "technology"
    )

    print("\n--- Second Article ---")
    news_publisher.publish_article(
        "Movie Star Announces Retirement",
        "Famous actor decides to retire after 30 years in the industry.",
        "entertainment"
    )

    # Detach a subscriber
    news_publisher.detach(lisa)

    # John subscribes to a new category
    john.subscribe_to_category("health")

    print("\n--- Third Article ---")
    news_publisher.publish_article(
        "New Health Guidelines Released",
        "Government announces updated health guidelines for the pandemic.",
        "health"
    )


if __name__ == "__main__":
    main() 
# Unit Testing

Unit testing is a software testing method where individual units or components of a software are tested in isolation from the rest of the system.

## What is Unit Testing?

A unit test verifies that a small, isolated piece of code (a "unit") behaves exactly as the developer expects. Units are typically:

- Individual functions or methods
- Classes
- Modules or components

The goal is to validate that each unit of the software performs as designed.

## Benefits of Unit Testing

- **Early Bug Detection**: Catch bugs early in the development cycle
- **Facilitates Changes**: Makes it easier to refactor code and add new features
- **Documentation**: Tests serve as documentation for how the code should behave
- **Design Improvement**: Encourages better software design and modularity
- **Confidence**: Provides confidence that the code works as expected
- **Reduces Costs**: Cheaper to fix bugs found during unit testing than later stages

## Unit Testing Principles

### FIRST Principles

- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Tests should yield the same results every time
- **Self-validating**: Tests should automatically determine if they pass or fail
- **Timely**: Tests should be written at the right time (ideally before the code)

### AAA Pattern

- **Arrange**: Set up the test conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the result is as expected

## Unit Testing Frameworks

### JavaScript (Jest)

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// math.test.js
const { add, subtract } = require('./math');

describe('Math functions', () => {
  test('add should correctly add two numbers', () => {
    // Arrange
    const a = 5;
    const b = 3;

    // Act
    const result = add(a, b);

    // Assert
    expect(result).toBe(8);
  });

  test('subtract should correctly subtract two numbers', () => {
    // Arrange
    const a = 5;
    const b = 3;

    // Act
    const result = subtract(a, b);

    // Assert
    expect(result).toBe(2);
  });
});
```

### Python (pytest)

```python
# math_utils.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# test_math_utils.py
import pytest
from math_utils import add, subtract

def test_add():
    # Arrange
    a = 5
    b = 3

    # Act
    result = add(a, b)

    # Assert
    assert result == 8

def test_subtract():
    # Arrange
    a = 5
    b = 3

    # Act
    result = subtract(a, b)

    # Assert
    assert result == 2
```

### Java (JUnit)

```java
// MathUtils.java
public class MathUtils {
    public int add(int a, int b) {
        return a + b;
    }

    public int subtract(int a, int b) {
        return a - b;
    }
}

// MathUtilsTest.java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class MathUtilsTest {

    @Test
    public void testAdd() {
        // Arrange
        MathUtils mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.add(a, b);

        // Assert
        assertEquals(8, result);
    }

    @Test
    public void testSubtract() {
        // Arrange
        MathUtils mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.subtract(a, b);

        // Assert
        assertEquals(2, result);
    }
}
```

### C# (xUnit)

```csharp
// MathUtils.cs
public class MathUtils
{
    public int Add(int a, int b)
    {
        return a + b;
    }

    public int Subtract(int a, int b)
    {
        return a - b;
    }
}

// MathUtilsTests.cs
using Xunit;

public class MathUtilsTests
{
    [Fact]
    public void Add_ShouldCorrectlyAddTwoNumbers()
    {
        // Arrange
        var mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.Add(a, b);

        // Assert
        Assert.Equal(8, result);
    }

    [Fact]
    public void Subtract_ShouldCorrectlySubtractTwoNumbers()
    {
        // Arrange
        var mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.Subtract(a, b);

        // Assert
        Assert.Equal(2, result);
    }
}
```

## Test Doubles

Test doubles are objects that replace real components in tests to isolate the code being tested.

### Types of Test Doubles

#### Dummy

Objects that are passed around but never actually used.

```javascript
// JavaScript example
function createUser(user, logger) {
  // logger is not used in this test
  return { id: 123, ...user };
}

test('createUser should add an ID to the user', () => {
  // Arrange
  const dummyLogger = {}; // Dummy object that's never used
  const user = { name: 'John' };

  // Act
  const result = createUser(user, dummyLogger);

  // Assert
  expect(result.id).toBeDefined();
  expect(result.name).toBe('John');
});
```

#### Stub

Objects that provide predefined answers to calls made during the test.

```java
// Java example
public interface WeatherService {
    int getCurrentTemperature(String city);
}

// Stub implementation
public class WeatherServiceStub implements WeatherService {
    @Override
    public int getCurrentTemperature(String city) {
        return 25; // Always returns 25°C regardless of the city
    }
}

@Test
public void testWeatherReporter() {
    // Arrange
    WeatherService stubService = new WeatherServiceStub();
    WeatherReporter reporter = new WeatherReporter(stubService);

    // Act
    String report = reporter.generateReport("London");

    // Assert
    assertEquals("Current temperature in London: 25°C", report);
}
```

#### Spy

Objects that record calls made to them.

```python
# Python example
class EmailServiceSpy:
    def __init__(self):
        self.emails_sent = []

    def send_email(self, to, subject, body):
        self.emails_sent.append({
            'to': to,
            'subject': subject,
            'body': body
        })

def test_user_registration_sends_welcome_email():
    # Arrange
    email_service = EmailServiceSpy()
    user_service = UserService(email_service)

    # Act
    user_service.register("john@example.com", "password123")

    # Assert
    assert len(email_service.emails_sent) == 1
    assert email_service.emails_sent[0]['to'] == "john@example.com"
    assert "Welcome" in email_service.emails_sent[0]['subject']
```

#### Mock

Objects that verify that specific methods were called with specific arguments.

```csharp
// C# example with Moq
[Fact]
public void Register_ShouldSendWelcomeEmail()
{
    // Arrange
    var mockEmailService = new Mock<IEmailService>();
    var userService = new UserService(mockEmailService.Object);

    // Act
    userService.Register("john@example.com", "password123");

    // Assert
    mockEmailService.Verify(
        x => x.SendEmail(
            "john@example.com",
            It.Is<string>(s => s.Contains("Welcome")),
            It.IsAny<string>()
        ),
        Times.Once
    );
}
```

#### Fake

Objects that have working implementations but are not suitable for production.

```javascript
// JavaScript example
class FakeUserRepository {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  create(userData) {
    const user = { id: this.nextId++, ...userData };
    this.users.push(user);
    return user;
  }

  findById(id) {
    return this.users.find(user => user.id === id);
  }
}

test('UserService should create a user', () => {
  // Arrange
  const fakeRepo = new FakeUserRepository();
  const userService = new UserService(fakeRepo);

  // Act
  const user = userService.createUser('John', 'john@example.com');

  // Assert
  expect(user.id).toBe(1);
  expect(user.name).toBe('John');
  expect(fakeRepo.findById(1)).toEqual(user);
});
```

## Test Coverage

Test coverage measures how much of your code is executed during tests.

### Coverage Metrics

- **Line Coverage**: Percentage of lines executed during tests
- **Branch Coverage**: Percentage of branches (if/else, switch) executed during tests
- **Function Coverage**: Percentage of functions called during tests
- **Statement Coverage**: Percentage of statements executed during tests

### Example Coverage Report (Jest)

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.71 |    66.67 |     100 |   85.71 |
 math.js            |     100 |      100 |     100 |     100 |
 string-utils.js    |   71.43 |    33.33 |     100 |   71.43 | 15-18
--------------------|---------|----------|---------|---------|-------------------
```

## Best Practices for Unit Testing

1. **Test One Thing at a Time**: Each test should verify one specific behavior.
2. **Keep Tests Simple**: Tests should be easy to understand and maintain.
3. **Use Descriptive Test Names**: Names should clearly describe what is being tested.
4. **Isolate the Unit**: Use test doubles to isolate the unit from its dependencies.
5. **Test Edge Cases**: Include tests for boundary conditions and error cases.
6. **Don't Test the Framework**: Focus on testing your code, not the framework or language.
7. **Maintain Test Independence**: Tests should not depend on each other or run in a specific order.
8. **Avoid Logic in Tests**: Tests should be straightforward with minimal logic.
9. **Write Tests First (TDD)**: Consider writing tests before implementing the code.
10. **Refactor Tests**: Keep tests clean and maintainable, just like production code.

## Test-Driven Development (TDD)

TDD is a development process where tests are written before the code. The cycle is:

1. **Red**: Write a failing test
2. **Green**: Write the minimal code to make the test pass
3. **Refactor**: Improve the code while keeping the tests passing

### TDD Example (JavaScript)

```javascript
// Step 1: Write a failing test
test('isPalindrome should return true for palindromes', () => {
  expect(isPalindrome('racecar')).toBe(true);
});

// Step 2: Write minimal code to make it pass
function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}

// Step 3: Add more tests
test('isPalindrome should return false for non-palindromes', () => {
  expect(isPalindrome('hello')).toBe(false);
});

test('isPalindrome should be case insensitive', () => {
  expect(isPalindrome('Racecar')).toBe(true);
});

// Step 4: Refactor the code
function isPalindrome(str) {
  const normalized = str.toLowerCase();
  return normalized === normalized.split('').reverse().join('');
}
```

## References

- [Martin Fowler on Unit Testing](https://martinfowler.com/bliki/UnitTest.html)
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [pytest Documentation](https://docs.pytest.org/)
- [JUnit Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [xUnit Documentation](https://xunit.net/docs/getting-started/netcore/cmdline)

package main

import (
	"fmt"
	"sort"
	"time"
)

// Graph represents an undirected graph using an adjacency list
type Graph struct {
	adjacencyList map[string][]string
}

// NewGraph creates a new empty graph
func NewGraph() *Graph {
	return &Graph{
		adjacencyList: make(map[string][]string),
	}
}

// AddVertex adds a vertex to the graph
func (g *Graph) AddVertex(vertex string) {
	if _, exists := g.adjacencyList[vertex]; !exists {
		g.adjacencyList[vertex] = []string{}
	}
}

// AddEdge adds an edge between two vertices
func (g *Graph) AddEdge(v1, v2 string) {
	// Ensure both vertices exist
	g.AddVertex(v1)
	g.AddVertex(v2)

	// Add the edge (for undirected graph)
	g.adjacencyList[v1] = append(g.adjacencyList[v1], v2)
	g.adjacencyList[v2] = append(g.adjacencyList[v2], v1)
}

// BFS performs a breadth-first search traversal starting from the given vertex
func (g *Graph) BFS(start string) []string {
	if _, exists := g.adjacencyList[start]; !exists {
		return []string{}
	}

	// Initialize data structures
	visited := make(map[string]bool)
	visited[start] = true

	queue := []string{start}
	result := []string{}

	fmt.Printf("Starting BFS traversal from vertex %s\n", start)

	// BFS traversal
	for len(queue) > 0 {
		// Dequeue the first vertex
		vertex := queue[0]
		queue = queue[1:]
		result = append(result, vertex)

		fmt.Printf("Visiting: %s\n", vertex)
		fmt.Printf("Queue: %v\n", queue)
		fmt.Printf("Visited so far: %v\n", result)
		fmt.Println("------------------------------")
		time.Sleep(500 * time.Millisecond) // Slow down for demonstration

		// Get sorted neighbors for consistent order
		neighbors := g.getSortedNeighbors(vertex)

		// Enqueue all unvisited neighbors
		for _, neighbor := range neighbors {
			if !visited[neighbor] {
				visited[neighbor] = true
				queue = append(queue, neighbor)
			}
		}
	}

	return result
}

// DFSRecursive performs a recursive depth-first search traversal starting from the given vertex
func (g *Graph) DFSRecursive(start string) []string {
	if _, exists := g.adjacencyList[start]; !exists {
		return []string{}
	}

	// Initialize data structures
	visited := make(map[string]bool)
	result := []string{}

	fmt.Printf("Starting recursive DFS traversal from vertex %s\n", start)

	// Define the recursive helper function
	var dfs func(vertex string)
	dfs = func(vertex string) {
		// Mark as visited and add to result
		visited[vertex] = true
		result = append(result, vertex)

		fmt.Printf("Visiting: %s\n", vertex)
		fmt.Printf("Visited so far: %v\n", result)
		fmt.Println("------------------------------")
		time.Sleep(500 * time.Millisecond) // Slow down for demonstration

		// Get sorted neighbors for consistent order
		neighbors := g.getSortedNeighbors(vertex)

		// Recursively visit all unvisited neighbors
		for _, neighbor := range neighbors {
			if !visited[neighbor] {
				dfs(neighbor)
			}
		}
	}

	// Start the DFS traversal
	dfs(start)
	return result
}

// DFSIterative performs an iterative depth-first search traversal starting from the given vertex
func (g *Graph) DFSIterative(start string) []string {
	if _, exists := g.adjacencyList[start]; !exists {
		return []string{}
	}

	// Initialize data structures
	visited := make(map[string]bool)
	stack := []string{start}
	result := []string{}

	fmt.Printf("Starting iterative DFS traversal from vertex %s\n", start)

	// DFS traversal using a stack
	for len(stack) > 0 {
		// Pop the last vertex from the stack
		lastIndex := len(stack) - 1
		vertex := stack[lastIndex]
		stack = stack[:lastIndex]

		// If not visited, process it
		if !visited[vertex] {
			visited[vertex] = true
			result = append(result, vertex)

			fmt.Printf("Visiting: %s\n", vertex)
			fmt.Printf("Stack: %v\n", stack)
			fmt.Printf("Visited so far: %v\n", result)
			fmt.Println("------------------------------")
			time.Sleep(500 * time.Millisecond) // Slow down for demonstration

			// Get sorted neighbors in reverse order for stack
			neighbors := g.getSortedNeighbors(vertex)
			// Reverse the order for stack to simulate recursive DFS
			for i, j := 0, len(neighbors)-1; i < j; i, j = i+1, j-1 {
				neighbors[i], neighbors[j] = neighbors[j], neighbors[i]
			}

			// Push all unvisited neighbors onto the stack
			for _, neighbor := range neighbors {
				if !visited[neighbor] {
					stack = append(stack, neighbor)
				}
			}
		}
	}

	return result
}

// VisualizeGraph prints a visualization of the graph structure
func (g *Graph) VisualizeGraph() {
	fmt.Println("\nGraph Structure:")
	fmt.Println("------------------------------")

	// Sort vertices for consistent output
	var vertices []string
	for vertex := range g.adjacencyList {
		vertices = append(vertices, vertex)
	}
	sort.Strings(vertices)

	for _, vertex := range vertices {
		neighbors := g.getSortedNeighbors(vertex)
		fmt.Printf("%s -> %v\n", vertex, neighbors)
	}

	fmt.Println("------------------------------")
}

// getSortedNeighbors returns the sorted neighbors of a vertex
func (g *Graph) getSortedNeighbors(vertex string) []string {
	neighbors := g.adjacencyList[vertex]
	sort.Strings(neighbors)
	return neighbors
}

// CreateSampleGraph creates a sample graph for demonstration
func CreateSampleGraph() *Graph {
	g := NewGraph()

	// Add edges to build this graph:
	//     A
	//    / \
	//   B   C
	//  / \   \
	// D   E---F

	edges := [][2]string{
		{"A", "B"}, {"A", "C"},
		{"B", "D"}, {"B", "E"},
		{"C", "F"}, {"E", "F"},
	}

	for _, edge := range edges {
		g.AddEdge(edge[0], edge[1])
	}

	return g
}

func main() {
	// Create a sample graph
	g := CreateSampleGraph()
	g.VisualizeGraph()

	// Demonstrate BFS
	fmt.Println("\n=== BFS Traversal ===")
	bfsResult := g.BFS("A")
	fmt.Printf("BFS Result: %v\n", bfsResult)

	// Demonstrate recursive DFS
	fmt.Println("\n=== DFS Traversal (Recursive) ===")
	dfsRecResult := g.DFSRecursive("A")
	fmt.Printf("DFS Recursive Result: %v\n", dfsRecResult)

	// Demonstrate iterative DFS
	fmt.Println("\n=== DFS Traversal (Iterative) ===")
	dfsIterResult := g.DFSIterative("A")
	fmt.Printf("DFS Iterative Result: %v\n", dfsIterResult)
} 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

/**
 * Graph Traversal Algorithms in C#
 * 
 * This program demonstrates BFS and DFS traversal algorithms on a graph.
 * 
 * Compile: dotnet build
 * Run: dotnet run
 */
namespace GraphTraversalAlgorithms
{
    /// <summary>
    /// A graph class using adjacency list representation
    /// </summary>
    public class Graph
    {
        // Adjacency list representation
        private Dictionary<string, List<string>> adjacencyList;

        /// <summary>
        /// Initializes a new empty graph
        /// </summary>
        public Graph()
        {
            adjacencyList = new Dictionary<string, List<string>>();
        }

        /// <summary>
        /// Adds a vertex to the graph
        /// </summary>
        /// <param name="vertex">The vertex to add</param>
        public void AddVertex(string vertex)
        {
            if (!adjacencyList.ContainsKey(vertex))
            {
                adjacencyList[vertex] = new List<string>();
            }
        }

        /// <summary>
        /// Adds an edge between two vertices
        /// </summary>
        /// <param name="v1">First vertex</param>
        /// <param name="v2">Second vertex</param>
        public void AddEdge(string v1, string v2)
        {
            // Ensure both vertices exist
            AddVertex(v1);
            AddVertex(v2);

            // Add the edge (undirected graph)
            adjacencyList[v1].Add(v2);
            adjacencyList[v2].Add(v1);
        }

        /// <summary>
        /// Helper method to get sorted neighbors for consistent output
        /// </summary>
        /// <param name="vertex">The vertex to get neighbors for</param>
        /// <returns>Sorted list of neighbors</returns>
        private List<string> GetSortedNeighbors(string vertex)
        {
            var neighbors = new List<string>(adjacencyList[vertex]);
            neighbors.Sort();
            return neighbors;
        }

        /// <summary>
        /// Performs a breadth-first search traversal starting from the given vertex
        /// </summary>
        /// <param name="start">Starting vertex</param>
        /// <returns>List of vertices in the order they were visited</returns>
        public List<string> BFS(string start)
        {
            if (!adjacencyList.ContainsKey(start))
            {
                return new List<string>();
            }

            HashSet<string> visited = new HashSet<string>();
            Queue<string> queue = new Queue<string>();
            List<string> result = new List<string>();

            // Initialize with starting vertex
            visited.Add(start);
            queue.Enqueue(start);

            Console.WriteLine($"Starting BFS traversal from vertex {start}");

            while (queue.Count > 0)
            {
                // Dequeue the first vertex
                string vertex = queue.Dequeue();
                result.Add(vertex);

                Console.WriteLine($"Visiting: {vertex}");
                Console.WriteLine($"Queue: [{string.Join(", ", queue)}]");
                Console.WriteLine($"Visited so far: [{string.Join(", ", result)}]");
                Console.WriteLine("------------------------------");

                // Pause for demonstration
                Thread.Sleep(500);

                // Get sorted neighbors for consistent order
                List<string> neighbors = GetSortedNeighbors(vertex);

                // Enqueue all unvisited neighbors
                foreach (string neighbor in neighbors)
                {
                    if (!visited.Contains(neighbor))
                    {
                        visited.Add(neighbor);
                        queue.Enqueue(neighbor);
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Performs a recursive depth-first search traversal starting from the given vertex
        /// </summary>
        /// <param name="start">Starting vertex</param>
        /// <returns>List of vertices in the order they were visited</returns>
        public List<string> DFSRecursive(string start)
        {
            if (!adjacencyList.ContainsKey(start))
            {
                return new List<string>();
            }

            HashSet<string> visited = new HashSet<string>();
            List<string> result = new List<string>();

            Console.WriteLine($"Starting recursive DFS traversal from vertex {start}");

            DFSHelper(start, visited, result);

            return result;
        }

        /// <summary>
        /// Helper method for recursive DFS
        /// </summary>
        /// <param name="vertex">Current vertex</param>
        /// <param name="visited">Set of visited vertices</param>
        /// <param name="result">List to store the traversal result</param>
        private void DFSHelper(string vertex, HashSet<string> visited, List<string> result)
        {
            // Mark as visited and add to result
            visited.Add(vertex);
            result.Add(vertex);

            Console.WriteLine($"Visiting: {vertex}");
            Console.WriteLine($"Visited so far: [{string.Join(", ", result)}]");
            Console.WriteLine("------------------------------");

            // Pause for demonstration
            Thread.Sleep(500);

            // Get sorted neighbors for consistent order
            List<string> neighbors = GetSortedNeighbors(vertex);

            // Recursively visit all unvisited neighbors
            foreach (string neighbor in neighbors)
            {
                if (!visited.Contains(neighbor))
                {
                    DFSHelper(neighbor, visited, result);
                }
            }
        }

        /// <summary>
        /// Performs an iterative depth-first search traversal starting from the given vertex
        /// </summary>
        /// <param name="start">Starting vertex</param>
        /// <returns>List of vertices in the order they were visited</returns>
        public List<string> DFSIterative(string start)
        {
            if (!adjacencyList.ContainsKey(start))
            {
                return new List<string>();
            }

            HashSet<string> visited = new HashSet<string>();
            Stack<string> stack = new Stack<string>();
            List<string> result = new List<string>();

            // Initialize with starting vertex
            stack.Push(start);

            Console.WriteLine($"Starting iterative DFS traversal from vertex {start}");

            while (stack.Count > 0)
            {
                // Pop the top vertex
                string vertex = stack.Pop();

                // If not visited, process it
                if (!visited.Contains(vertex))
                {
                    visited.Add(vertex);
                    result.Add(vertex);

                    Console.WriteLine($"Visiting: {vertex}");
                    Console.WriteLine($"Stack: [{string.Join(", ", stack)}]");
                    Console.WriteLine($"Visited so far: [{string.Join(", ", result)}]");
                    Console.WriteLine("------------------------------");

                    // Pause for demonstration
                    Thread.Sleep(500);

                    // Get sorted neighbors in reverse order for stack
                    List<string> neighbors = GetSortedNeighbors(vertex);
                    neighbors.Reverse();

                    // Push all unvisited neighbors onto the stack
                    foreach (string neighbor in neighbors)
                    {
                        if (!visited.Contains(neighbor))
                        {
                            stack.Push(neighbor);
                        }
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Prints a visualization of the graph structure
        /// </summary>
        public void VisualizeGraph()
        {
            Console.WriteLine("\nGraph Structure:");
            Console.WriteLine("------------------------------");

            // Sort vertices for consistent output
            var vertices = adjacencyList.Keys.ToList();
            vertices.Sort();

            foreach (string vertex in vertices)
            {
                List<string> neighbors = GetSortedNeighbors(vertex);
                Console.WriteLine($"{vertex} -> [{string.Join(", ", neighbors)}]");
            }

            Console.WriteLine("------------------------------");
        }
    }

    public class Program
    {
        /// <summary>
        /// Creates a sample graph for demonstration
        /// </summary>
        /// <returns>A sample graph</returns>
        public static Graph CreateSampleGraph()
        {
            Graph g = new Graph();

            // Add edges to build this graph:
            //     A
            //    / \
            //   B   C
            //  / \   \
            // D   E---F

            string[,] edges = {
                {"A", "B"}, {"A", "C"},
                {"B", "D"}, {"B", "E"},
                {"C", "F"}, {"E", "F"}
            };

            for (int i = 0; i < edges.GetLength(0); i++)
            {
                g.AddEdge(edges[i, 0], edges[i, 1]);
            }

            return g;
        }

        public static void Main(string[] args)
        {
            // Create a sample graph
            Graph g = CreateSampleGraph();
            g.VisualizeGraph();

            // Demonstrate BFS
            Console.WriteLine("\n=== BFS Traversal ===");
            List<string> bfsResult = g.BFS("A");
            Console.WriteLine($"BFS Result: [{string.Join(", ", bfsResult)}]");

            // Demonstrate recursive DFS
            Console.WriteLine("\n=== DFS Traversal (Recursive) ===");
            List<string> dfsRecResult = g.DFSRecursive("A");
            Console.WriteLine($"DFS Recursive Result: [{string.Join(", ", dfsRecResult)}]");

            // Demonstrate iterative DFS
            Console.WriteLine("\n=== DFS Traversal (Iterative) ===");
            List<string> dfsIterResult = g.DFSIterative("A");
            Console.WriteLine($"DFS Iterative Result: [{string.Join(", ", dfsIterResult)}]");
        }
    }
} 
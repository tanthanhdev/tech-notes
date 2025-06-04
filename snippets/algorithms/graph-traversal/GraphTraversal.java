import java.util.*;

/**
 * Graph Traversal Algorithms in Java
 * 
 * This class demonstrates BFS and DFS traversal algorithms on a graph.
 * 
 * Compile: javac GraphTraversal.java
 * Run: java GraphTraversal
 */
public class GraphTraversal {
    
    /**
     * Graph class representing a graph using adjacency list
     */
    static class Graph {
        // Adjacency list representation
        private Map<String, List<String>> adjacencyList;
        
        /**
         * Initialize an empty graph
         */
        public Graph() {
            this.adjacencyList = new HashMap<>();
        }
        
        /**
         * Add a vertex to the graph
         * @param vertex The vertex to add
         */
        public void addVertex(String vertex) {
            if (!adjacencyList.containsKey(vertex)) {
                adjacencyList.put(vertex, new ArrayList<>());
            }
        }
        
        /**
         * Add an edge between two vertices
         * @param v1 First vertex
         * @param v2 Second vertex
         */
        public void addEdge(String v1, String v2) {
            // Ensure both vertices exist
            addVertex(v1);
            addVertex(v2);
            
            // Add the edge (undirected graph)
            adjacencyList.get(v1).add(v2);
            adjacencyList.get(v2).add(v1);
        }
        
        /**
         * Helper method to get sorted neighbors for consistent output
         * @param vertex The vertex to get neighbors for
         * @return Sorted list of neighbors
         */
        private List<String> getSortedNeighbors(String vertex) {
            List<String> neighbors = new ArrayList<>(adjacencyList.get(vertex));
            Collections.sort(neighbors);
            return neighbors;
        }
        
        /**
         * Breadth-First Search traversal
         * @param start Starting vertex
         * @return List of vertices in the order they were visited
         */
        public List<String> bfs(String start) {
            if (!adjacencyList.containsKey(start)) {
                return new ArrayList<>();
            }
            
            Set<String> visited = new HashSet<>();
            Queue<String> queue = new LinkedList<>();
            List<String> result = new ArrayList<>();
            
            // Initialize with starting vertex
            visited.add(start);
            queue.add(start);
            
            System.out.println("Starting BFS traversal from vertex " + start);
            
            while (!queue.isEmpty()) {
                // Dequeue the first vertex
                String vertex = queue.poll();
                result.add(vertex);
                
                System.out.println("Visiting: " + vertex);
                System.out.println("Queue: " + queue);
                System.out.println("Visited so far: " + result);
                System.out.println("------------------------------");
                
                // Pause for demonstration
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                
                // Get sorted neighbors for consistent order
                List<String> neighbors = getSortedNeighbors(vertex);
                
                // Enqueue all unvisited neighbors
                for (String neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        visited.add(neighbor);
                        queue.add(neighbor);
                    }
                }
            }
            
            return result;
        }
        
        /**
         * Depth-First Search traversal (recursive)
         * @param start Starting vertex
         * @return List of vertices in the order they were visited
         */
        public List<String> dfsRecursive(String start) {
            if (!adjacencyList.containsKey(start)) {
                return new ArrayList<>();
            }
            
            Set<String> visited = new HashSet<>();
            List<String> result = new ArrayList<>();
            
            System.out.println("Starting recursive DFS traversal from vertex " + start);
            
            dfsHelper(start, visited, result);
            
            return result;
        }
        
        /**
         * Helper method for recursive DFS
         * @param vertex Current vertex
         * @param visited Set of visited vertices
         * @param result List to store the traversal result
         */
        private void dfsHelper(String vertex, Set<String> visited, List<String> result) {
            // Mark as visited and add to result
            visited.add(vertex);
            result.add(vertex);
            
            System.out.println("Visiting: " + vertex);
            System.out.println("Visited so far: " + result);
            System.out.println("------------------------------");
            
            // Pause for demonstration
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            
            // Get sorted neighbors for consistent order
            List<String> neighbors = getSortedNeighbors(vertex);
            
            // Recursively visit all unvisited neighbors
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    dfsHelper(neighbor, visited, result);
                }
            }
        }
        
        /**
         * Depth-First Search traversal (iterative)
         * @param start Starting vertex
         * @return List of vertices in the order they were visited
         */
        public List<String> dfsIterative(String start) {
            if (!adjacencyList.containsKey(start)) {
                return new ArrayList<>();
            }
            
            Set<String> visited = new HashSet<>();
            Stack<String> stack = new Stack<>();
            List<String> result = new ArrayList<>();
            
            // Initialize with starting vertex
            stack.push(start);
            
            System.out.println("Starting iterative DFS traversal from vertex " + start);
            
            while (!stack.isEmpty()) {
                // Pop the top vertex
                String vertex = stack.pop();
                
                // If not visited, process it
                if (!visited.contains(vertex)) {
                    visited.add(vertex);
                    result.add(vertex);
                    
                    System.out.println("Visiting: " + vertex);
                    System.out.println("Stack: " + stack);
                    System.out.println("Visited so far: " + result);
                    System.out.println("------------------------------");
                    
                    // Pause for demonstration
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    
                    // Get sorted neighbors in reverse order for stack
                    List<String> neighbors = getSortedNeighbors(vertex);
                    Collections.reverse(neighbors);
                    
                    // Push all unvisited neighbors onto the stack
                    for (String neighbor : neighbors) {
                        if (!visited.contains(neighbor)) {
                            stack.push(neighbor);
                        }
                    }
                }
            }
            
            return result;
        }
        
        /**
         * Print the graph structure
         */
        public void visualizeGraph() {
            System.out.println("\nGraph Structure:");
            System.out.println("------------------------------");
            
            // Sort vertices for consistent output
            List<String> vertices = new ArrayList<>(adjacencyList.keySet());
            Collections.sort(vertices);
            
            for (String vertex : vertices) {
                List<String> neighbors = getSortedNeighbors(vertex);
                System.out.println(vertex + " -> " + neighbors);
            }
            
            System.out.println("------------------------------");
        }
    }
    
    /**
     * Create a sample graph for demonstration
     * @return A sample graph
     */
    public static Graph createSampleGraph() {
        Graph g = new Graph();
        
        // Add edges to build this graph:
        //     A
        //    / \
        //   B   C
        //  / \   \
        // D   E---F
        
        String[][] edges = {
            {"A", "B"}, {"A", "C"},
            {"B", "D"}, {"B", "E"},
            {"C", "F"}, {"E", "F"}
        };
        
        for (String[] edge : edges) {
            g.addEdge(edge[0], edge[1]);
        }
        
        return g;
    }
    
    /**
     * Main method to demonstrate graph traversal algorithms
     * @param args Command line arguments (not used)
     */
    public static void main(String[] args) {
        // Create a sample graph
        Graph g = createSampleGraph();
        g.visualizeGraph();
        
        // Demonstrate BFS
        System.out.println("\n=== BFS Traversal ===");
        List<String> bfsResult = g.bfs("A");
        System.out.println("BFS Result: " + bfsResult);
        
        // Demonstrate recursive DFS
        System.out.println("\n=== DFS Traversal (Recursive) ===");
        List<String> dfsRecResult = g.dfsRecursive("A");
        System.out.println("DFS Recursive Result: " + dfsRecResult);
        
        // Demonstrate iterative DFS
        System.out.println("\n=== DFS Traversal (Iterative) ===");
        List<String> dfsIterResult = g.dfsIterative("A");
        System.out.println("DFS Iterative Result: " + dfsIterResult);
    }
} 
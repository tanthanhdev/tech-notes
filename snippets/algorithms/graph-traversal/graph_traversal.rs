use std::collections::{HashMap, HashSet, VecDeque};
use std::thread;
use std::time::Duration;

/// Graph Traversal Algorithms in Rust
///
/// This program demonstrates BFS and DFS traversal algorithms on a graph.
///
/// Compile: rustc graph_traversal.rs
/// Run: ./graph_traversal

/// A graph using adjacency list representation
struct Graph {
    // Adjacency list representation
    adjacency_list: HashMap<String, Vec<String>>,
}

impl Graph {
    /// Creates a new empty graph
    fn new() -> Self {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    /// Adds a vertex to the graph
    fn add_vertex(&mut self, vertex: &str) {
        self.adjacency_list.entry(vertex.to_string()).or_insert(Vec::new());
    }

    /// Adds an edge between two vertices
    fn add_edge(&mut self, v1: &str, v2: &str) {
        // Ensure both vertices exist
        self.add_vertex(v1);
        self.add_vertex(v2);
        
        // Add the edge (undirected graph)
        self.adjacency_list.get_mut(v1).unwrap().push(v2.to_string());
        self.adjacency_list.get_mut(v2).unwrap().push(v1.to_string());
    }

    /// Helper method to get sorted neighbors for consistent output
    fn get_sorted_neighbors(&self, vertex: &str) -> Vec<String> {
        let mut neighbors = self.adjacency_list[vertex].clone();
        neighbors.sort();
        neighbors
    }

    /// Performs a breadth-first search traversal starting from the given vertex
    fn bfs(&self, start: &str) -> Vec<String> {
        if !self.adjacency_list.contains_key(start) {
            return Vec::new();
        }
        
        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();
        let mut result = Vec::new();
        
        // Initialize with starting vertex
        visited.insert(start.to_string());
        queue.push_back(start.to_string());
        
        println!("Starting BFS traversal from vertex {}", start);
        
        while !queue.is_empty() {
            // Dequeue the first vertex
            let vertex = queue.pop_front().unwrap();
            result.push(vertex.clone());
            
            println!("Visiting: {}", vertex);
            println!("Queue: {:?}", queue);
            println!("Visited so far: {:?}", result);
            println!("------------------------------");
            
            // Pause for demonstration
            thread::sleep(Duration::from_millis(500));
            
            // Get sorted neighbors for consistent order
            let neighbors = self.get_sorted_neighbors(&vertex);
            
            // Enqueue all unvisited neighbors
            for neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    visited.insert(neighbor.clone());
                    queue.push_back(neighbor);
                }
            }
        }
        
        result
    }

    /// Performs a recursive depth-first search traversal starting from the given vertex
    fn dfs_recursive(&self, start: &str) -> Vec<String> {
        if !self.adjacency_list.contains_key(start) {
            return Vec::new();
        }
        
        let mut visited = HashSet::new();
        let mut result = Vec::new();
        
        println!("Starting recursive DFS traversal from vertex {}", start);
        
        self.dfs_helper(start, &mut visited, &mut result);
        
        result
    }

    /// Helper method for recursive DFS
    fn dfs_helper(&self, vertex: &str, visited: &mut HashSet<String>, result: &mut Vec<String>) {
        // Mark as visited and add to result
        visited.insert(vertex.to_string());
        result.push(vertex.to_string());
        
        println!("Visiting: {}", vertex);
        println!("Visited so far: {:?}", result);
        println!("------------------------------");
        
        // Pause for demonstration
        thread::sleep(Duration::from_millis(500));
        
        // Get sorted neighbors for consistent order
        let neighbors = self.get_sorted_neighbors(vertex);
        
        // Recursively visit all unvisited neighbors
        for neighbor in neighbors {
            if !visited.contains(&neighbor) {
                self.dfs_helper(&neighbor, visited, result);
            }
        }
    }

    /// Performs an iterative depth-first search traversal starting from the given vertex
    fn dfs_iterative(&self, start: &str) -> Vec<String> {
        if !self.adjacency_list.contains_key(start) {
            return Vec::new();
        }
        
        let mut visited = HashSet::new();
        let mut stack = Vec::new();
        let mut result = Vec::new();
        
        // Initialize with starting vertex
        stack.push(start.to_string());
        
        println!("Starting iterative DFS traversal from vertex {}", start);
        
        while !stack.is_empty() {
            // Pop the top vertex
            let vertex = stack.pop().unwrap();
            
            // If not visited, process it
            if !visited.contains(&vertex) {
                visited.insert(vertex.clone());
                result.push(vertex.clone());
                
                println!("Visiting: {}", vertex);
                println!("Stack: {:?}", stack);
                println!("Visited so far: {:?}", result);
                println!("------------------------------");
                
                // Pause for demonstration
                thread::sleep(Duration::from_millis(500));
                
                // Get sorted neighbors in reverse order for stack
                let mut neighbors = self.get_sorted_neighbors(&vertex);
                neighbors.reverse();
                
                // Push all unvisited neighbors onto the stack
                for neighbor in neighbors {
                    if !visited.contains(&neighbor) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        
        result
    }

    /// Prints a visualization of the graph structure
    fn visualize_graph(&self) {
        println!("\nGraph Structure:");
        println!("------------------------------");
        
        // Sort vertices for consistent output
        let mut vertices: Vec<String> = self.adjacency_list.keys().cloned().collect();
        vertices.sort();
        
        for vertex in vertices {
            let neighbors = self.get_sorted_neighbors(&vertex);
            println!("{} -> {:?}", vertex, neighbors);
        }
        
        println!("------------------------------");
    }
}

/// Creates a sample graph for demonstration
fn create_sample_graph() -> Graph {
    let mut g = Graph::new();
    
    // Add edges to build this graph:
    //     A
    //    / \
    //   B   C
    //  / \   \
    // D   E---F
    
    let edges = [
        ("A", "B"), ("A", "C"),
        ("B", "D"), ("B", "E"),
        ("C", "F"), ("E", "F")
    ];
    
    for (v1, v2) in edges.iter() {
        g.add_edge(v1, v2);
    }
    
    g
}

fn main() {
    // Create a sample graph
    let g = create_sample_graph();
    g.visualize_graph();
    
    // Demonstrate BFS
    println!("\n=== BFS Traversal ===");
    let bfs_result = g.bfs("A");
    println!("BFS Result: {:?}", bfs_result);
    
    // Demonstrate recursive DFS
    println!("\n=== DFS Traversal (Recursive) ===");
    let dfs_rec_result = g.dfs_recursive("A");
    println!("DFS Recursive Result: {:?}", dfs_rec_result);
    
    // Demonstrate iterative DFS
    println!("\n=== DFS Traversal (Iterative) ===");
    let dfs_iter_result = g.dfs_iterative("A");
    println!("DFS Iterative Result: {:?}", dfs_iter_result);
} 
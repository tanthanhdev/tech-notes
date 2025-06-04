/**
 * Graph Traversal Algorithms in JavaScript
 * 
 * This module provides implementations of BFS and DFS for graph traversal.
 * 
 * Example usage:
 *   node graphTraversal.js
 */

class Graph {
  /**
   * Initialize an empty graph
   */
  constructor() {
    this.adjacencyList = {};
  }

  /**
   * Add a vertex to the graph
   * @param {string|number} vertex - The vertex to add
   */
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  /**
   * Add an edge between two vertices
   * @param {string|number} v1 - First vertex
   * @param {string|number} v2 - Second vertex
   */
  addEdge(v1, v2) {
    if (!this.adjacencyList[v1]) {
      this.addVertex(v1);
    }
    if (!this.adjacencyList[v2]) {
      this.addVertex(v2);
    }
    
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1); // For undirected graph
  }

  /**
   * Breadth-First Search traversal
   * @param {string|number} start - Starting vertex
   * @returns {Array} - Vertices in the order they were visited
   */
  bfs(start) {
    if (!this.adjacencyList[start]) return [];
    
    const queue = [start];
    const visited = { [start]: true };
    const result = [];
    
    console.log(`Starting BFS traversal from vertex ${start}`);
    
    while (queue.length) {
      const currentVertex = queue.shift();
      result.push(currentVertex);
      
      console.log(`Visiting: ${currentVertex}`);
      console.log(`Queue: [${queue.join(', ')}]`);
      console.log(`Visited so far: [${result.join(', ')}]`);
      console.log('-'.repeat(30));
      
      // Get neighbors and sort for consistent order
      const neighbors = [...this.adjacencyList[currentVertex]].sort();
      
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }

  /**
   * Depth-First Search traversal (recursive)
   * @param {string|number} start - Starting vertex
   * @returns {Array} - Vertices in the order they were visited
   */
  dfsRecursive(start) {
    if (!this.adjacencyList[start]) return [];
    
    const visited = {};
    const result = [];
    
    console.log(`Starting recursive DFS traversal from vertex ${start}`);
    
    const dfs = (vertex) => {
      visited[vertex] = true;
      result.push(vertex);
      
      console.log(`Visiting: ${vertex}`);
      console.log(`Visited so far: [${result.join(', ')}]`);
      console.log('-'.repeat(30));
      
      // Get neighbors and sort for consistent order
      const neighbors = [...this.adjacencyList[vertex]].sort();
      
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          dfs(neighbor);
        }
      }
    };
    
    dfs(start);
    return result;
  }

  /**
   * Depth-First Search traversal (iterative)
   * @param {string|number} start - Starting vertex
   * @returns {Array} - Vertices in the order they were visited
   */
  dfsIterative(start) {
    if (!this.adjacencyList[start]) return [];
    
    const stack = [start];
    const visited = {};
    const result = [];
    
    console.log(`Starting iterative DFS traversal from vertex ${start}`);
    
    while (stack.length) {
      const currentVertex = stack.pop();
      
      if (!visited[currentVertex]) {
        visited[currentVertex] = true;
        result.push(currentVertex);
        
        console.log(`Visiting: ${currentVertex}`);
        console.log(`Stack: [${stack.join(', ')}]`);
        console.log(`Visited so far: [${result.join(', ')}]`);
        console.log('-'.repeat(30));
        
        // Get neighbors and sort in reverse order for stack
        const neighbors = [...this.adjacencyList[currentVertex]].sort().reverse();
        
        for (const neighbor of neighbors) {
          if (!visited[neighbor]) {
            stack.push(neighbor);
          }
        }
      }
    }
    
    return result;
  }

  /**
   * Print a visualization of the graph structure
   */
  visualizeGraph() {
    console.log('\nGraph Structure:');
    console.log('-'.repeat(30));
    
    // Sort the vertices for consistent output
    const vertices = Object.keys(this.adjacencyList).sort();
    
    for (const vertex of vertices) {
      const neighbors = [...this.adjacencyList[vertex]].sort();
      console.log(`${vertex} -> [${neighbors.join(', ')}]`);
    }
    
    console.log('-'.repeat(30));
  }
}

/**
 * Create a sample graph for demonstration
 * @returns {Graph} - A sample graph
 */
function createSampleGraph() {
  const g = new Graph();
  
  // Add edges to build this graph:
  //     A
  //    / \
  //   B   C
  //  / \   \
  // D   E---F
  
  const edges = [
    ['A', 'B'], ['A', 'C'],
    ['B', 'D'], ['B', 'E'],
    ['C', 'F'], ['E', 'F']
  ];
  
  for (const [v1, v2] of edges) {
    g.addEdge(v1, v2);
  }
  
  return g;
}

/**
 * Main function to demonstrate graph traversal algorithms
 */
function main() {
  const g = createSampleGraph();
  g.visualizeGraph();
  
  console.log('\n=== BFS Traversal ===');
  const bfsResult = g.bfs('A');
  console.log(`BFS Result: [${bfsResult.join(', ')}]`);
  
  console.log('\n=== DFS Traversal (Recursive) ===');
  const dfsRecResult = g.dfsRecursive('A');
  console.log(`DFS Recursive Result: [${dfsRecResult.join(', ')}]`);
  
  console.log('\n=== DFS Traversal (Iterative) ===');
  const dfsIterResult = g.dfsIterative('A');
  console.log(`DFS Iterative Result: [${dfsIterResult.join(', ')}]`);
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

// Export the Graph class for use in other modules
module.exports = { Graph, createSampleGraph }; 
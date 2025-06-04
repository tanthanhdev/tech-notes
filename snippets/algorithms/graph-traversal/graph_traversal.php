<?php
/**
 * Graph Traversal Algorithms in PHP
 * 
 * This script demonstrates BFS and DFS traversal algorithms on a graph.
 * 
 * Run: php graph_traversal.php
 */

/**
 * A graph class using adjacency list representation
 */
class Graph {
    // Adjacency list representation
    private $adjacencyList = [];
    
    /**
     * Adds a vertex to the graph
     * 
     * @param string $vertex The vertex to add
     */
    public function addVertex($vertex) {
        if (!isset($this->adjacencyList[$vertex])) {
            $this->adjacencyList[$vertex] = [];
        }
    }
    
    /**
     * Adds an edge between two vertices
     * 
     * @param string $v1 First vertex
     * @param string $v2 Second vertex
     */
    public function addEdge($v1, $v2) {
        // Ensure both vertices exist
        $this->addVertex($v1);
        $this->addVertex($v2);
        
        // Add the edge (undirected graph)
        $this->adjacencyList[$v1][] = $v2;
        $this->adjacencyList[$v2][] = $v1;
    }
    
    /**
     * Helper method to get sorted neighbors for consistent output
     * 
     * @param string $vertex The vertex to get neighbors for
     * @return array Sorted array of neighbors
     */
    private function getSortedNeighbors($vertex) {
        $neighbors = $this->adjacencyList[$vertex];
        sort($neighbors);
        return $neighbors;
    }
    
    /**
     * Performs a breadth-first search traversal starting from the given vertex
     * 
     * @param string $start Starting vertex
     * @return array Array of vertices in the order they were visited
     */
    public function bfs($start) {
        if (!isset($this->adjacencyList[$start])) {
            return [];
        }
        
        $visited = [$start => true];
        $queue = [$start];
        $result = [];
        
        echo "Starting BFS traversal from vertex $start\n";
        
        while (count($queue) > 0) {
            // Dequeue the first vertex
            $vertex = array_shift($queue);
            $result[] = $vertex;
            
            echo "Visiting: $vertex\n";
            echo "Queue: [" . implode(", ", $queue) . "]\n";
            echo "Visited so far: [" . implode(", ", $result) . "]\n";
            echo "------------------------------\n";
            
            // Pause for demonstration
            usleep(500000); // 500ms
            
            // Get sorted neighbors for consistent order
            $neighbors = $this->getSortedNeighbors($vertex);
            
            // Enqueue all unvisited neighbors
            foreach ($neighbors as $neighbor) {
                if (!isset($visited[$neighbor])) {
                    $visited[$neighbor] = true;
                    $queue[] = $neighbor;
                }
            }
        }
        
        return $result;
    }
    
    /**
     * Performs a recursive depth-first search traversal starting from the given vertex
     * 
     * @param string $start Starting vertex
     * @return array Array of vertices in the order they were visited
     */
    public function dfsRecursive($start) {
        if (!isset($this->adjacencyList[$start])) {
            return [];
        }
        
        $visited = [];
        $result = [];
        
        echo "Starting recursive DFS traversal from vertex $start\n";
        
        $this->dfsHelper($start, $visited, $result);
        
        return $result;
    }
    
    /**
     * Helper method for recursive DFS
     * 
     * @param string $vertex Current vertex
     * @param array &$visited Reference to array of visited vertices
     * @param array &$result Reference to array to store the traversal result
     */
    private function dfsHelper($vertex, &$visited, &$result) {
        // Mark as visited and add to result
        $visited[$vertex] = true;
        $result[] = $vertex;
        
        echo "Visiting: $vertex\n";
        echo "Visited so far: [" . implode(", ", $result) . "]\n";
        echo "------------------------------\n";
        
        // Pause for demonstration
        usleep(500000); // 500ms
        
        // Get sorted neighbors for consistent order
        $neighbors = $this->getSortedNeighbors($vertex);
        
        // Recursively visit all unvisited neighbors
        foreach ($neighbors as $neighbor) {
            if (!isset($visited[$neighbor])) {
                $this->dfsHelper($neighbor, $visited, $result);
            }
        }
    }
    
    /**
     * Performs an iterative depth-first search traversal starting from the given vertex
     * 
     * @param string $start Starting vertex
     * @return array Array of vertices in the order they were visited
     */
    public function dfsIterative($start) {
        if (!isset($this->adjacencyList[$start])) {
            return [];
        }
        
        $visited = [];
        $stack = [$start];
        $result = [];
        
        echo "Starting iterative DFS traversal from vertex $start\n";
        
        while (count($stack) > 0) {
            // Pop the top vertex
            $vertex = array_pop($stack);
            
            // If not visited, process it
            if (!isset($visited[$vertex])) {
                $visited[$vertex] = true;
                $result[] = $vertex;
                
                echo "Visiting: $vertex\n";
                echo "Stack: [" . implode(", ", $stack) . "]\n";
                echo "Visited so far: [" . implode(", ", $result) . "]\n";
                echo "------------------------------\n";
                
                // Pause for demonstration
                usleep(500000); // 500ms
                
                // Get sorted neighbors in reverse order for stack
                $neighbors = $this->getSortedNeighbors($vertex);
                $neighbors = array_reverse($neighbors);
                
                // Push all unvisited neighbors onto the stack
                foreach ($neighbors as $neighbor) {
                    if (!isset($visited[$neighbor])) {
                        $stack[] = $neighbor;
                    }
                }
            }
        }
        
        return $result;
    }
    
    /**
     * Prints a visualization of the graph structure
     */
    public function visualizeGraph() {
        echo "\nGraph Structure:\n";
        echo "------------------------------\n";
        
        // Sort vertices for consistent output
        $vertices = array_keys($this->adjacencyList);
        sort($vertices);
        
        foreach ($vertices as $vertex) {
            $neighbors = $this->getSortedNeighbors($vertex);
            echo "$vertex -> [" . implode(", ", $neighbors) . "]\n";
        }
        
        echo "------------------------------\n";
    }
}

/**
 * Creates a sample graph for demonstration
 * 
 * @return Graph A sample graph
 */
function createSampleGraph() {
    $g = new Graph();
    
    // Add edges to build this graph:
    //     A
    //    / \
    //   B   C
    //  / \   \
    // D   E---F
    
    $edges = [
        ["A", "B"], ["A", "C"],
        ["B", "D"], ["B", "E"],
        ["C", "F"], ["E", "F"]
    ];
    
    foreach ($edges as $edge) {
        $g->addEdge($edge[0], $edge[1]);
    }
    
    return $g;
}

// Main execution
$g = createSampleGraph();
$g->visualizeGraph();

// Demonstrate BFS
echo "\n=== BFS Traversal ===\n";
$bfsResult = $g->bfs("A");
echo "BFS Result: [" . implode(", ", $bfsResult) . "]\n";

// Demonstrate recursive DFS
echo "\n=== DFS Traversal (Recursive) ===\n";
$dfsRecResult = $g->dfsRecursive("A");
echo "DFS Recursive Result: [" . implode(", ", $dfsRecResult) . "]\n";

// Demonstrate iterative DFS
echo "\n=== DFS Traversal (Iterative) ===\n";
$dfsIterResult = $g->dfsIterative("A");
echo "DFS Iterative Result: [" . implode(", ", $dfsIterResult) . "]\n";
?> 
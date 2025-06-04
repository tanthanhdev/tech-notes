#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <chrono>
#include <thread>

/**
 * Graph Traversal Algorithms in C++
 * 
 * This program demonstrates BFS and DFS traversal algorithms on a graph.
 * 
 * Compile: g++ -std=c++11 graph_traversal.cpp -o graph_traversal
 * Run: ./graph_traversal
 */

class Graph {
private:
    // Adjacency list representation
    std::unordered_map<std::string, std::vector<std::string>> adjacencyList;
    
    // Helper function to get sorted neighbors for consistent output
    std::vector<std::string> getSortedNeighbors(const std::string& vertex) const {
        std::vector<std::string> neighbors = adjacencyList.at(vertex);
        std::sort(neighbors.begin(), neighbors.end());
        return neighbors;
    }
    
    // Helper for recursive DFS
    void dfsHelper(const std::string& vertex, std::unordered_set<std::string>& visited, 
                   std::vector<std::string>& result) const {
        // Mark as visited and add to result
        visited.insert(vertex);
        result.push_back(vertex);
        
        std::cout << "Visiting: " << vertex << std::endl;
        std::cout << "Visited so far: [";
        for (size_t i = 0; i < result.size(); ++i) {
            std::cout << result[i];
            if (i < result.size() - 1) std::cout << ", ";
        }
        std::cout << "]" << std::endl;
        std::cout << "------------------------------" << std::endl;
        
        // Pause for demonstration
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        
        // Get sorted neighbors for consistent order
        std::vector<std::string> neighbors = getSortedNeighbors(vertex);
        
        // Recursively visit all unvisited neighbors
        for (const auto& neighbor : neighbors) {
            if (visited.find(neighbor) == visited.end()) {
                dfsHelper(neighbor, visited, result);
            }
        }
    }
    
public:
    // Add a vertex to the graph
    void addVertex(const std::string& vertex) {
        if (adjacencyList.find(vertex) == adjacencyList.end()) {
            adjacencyList[vertex] = std::vector<std::string>();
        }
    }
    
    // Add an edge between two vertices
    void addEdge(const std::string& v1, const std::string& v2) {
        // Ensure both vertices exist
        addVertex(v1);
        addVertex(v2);
        
        // Add the edge (undirected graph)
        adjacencyList[v1].push_back(v2);
        adjacencyList[v2].push_back(v1);
    }
    
    // Breadth-First Search traversal
    std::vector<std::string> bfs(const std::string& start) const {
        if (adjacencyList.find(start) == adjacencyList.end()) {
            return {};
        }
        
        std::unordered_set<std::string> visited;
        std::queue<std::string> queue;
        std::vector<std::string> result;
        
        // Initialize with starting vertex
        visited.insert(start);
        queue.push(start);
        
        std::cout << "Starting BFS traversal from vertex " << start << std::endl;
        
        while (!queue.empty()) {
            // Dequeue the first vertex
            std::string vertex = queue.front();
            queue.pop();
            result.push_back(vertex);
            
            std::cout << "Visiting: " << vertex << std::endl;
            
            // Print queue contents
            std::cout << "Queue: [";
            std::queue<std::string> queueCopy = queue;
            bool first = true;
            while (!queueCopy.empty()) {
                if (!first) std::cout << ", ";
                std::cout << queueCopy.front();
                queueCopy.pop();
                first = false;
            }
            std::cout << "]" << std::endl;
            
            // Print visited vertices
            std::cout << "Visited so far: [";
            for (size_t i = 0; i < result.size(); ++i) {
                std::cout << result[i];
                if (i < result.size() - 1) std::cout << ", ";
            }
            std::cout << "]" << std::endl;
            std::cout << "------------------------------" << std::endl;
            
            // Pause for demonstration
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
            
            // Get sorted neighbors for consistent order
            std::vector<std::string> neighbors = getSortedNeighbors(vertex);
            
            // Enqueue all unvisited neighbors
            for (const auto& neighbor : neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        return result;
    }
    
    // Depth-First Search traversal (recursive)
    std::vector<std::string> dfsRecursive(const std::string& start) const {
        if (adjacencyList.find(start) == adjacencyList.end()) {
            return {};
        }
        
        std::unordered_set<std::string> visited;
        std::vector<std::string> result;
        
        std::cout << "Starting recursive DFS traversal from vertex " << start << std::endl;
        
        dfsHelper(start, visited, result);
        
        return result;
    }
    
    // Depth-First Search traversal (iterative)
    std::vector<std::string> dfsIterative(const std::string& start) const {
        if (adjacencyList.find(start) == adjacencyList.end()) {
            return {};
        }
        
        std::unordered_set<std::string> visited;
        std::stack<std::string> stack;
        std::vector<std::string> result;
        
        // Initialize with starting vertex
        stack.push(start);
        
        std::cout << "Starting iterative DFS traversal from vertex " << start << std::endl;
        
        while (!stack.empty()) {
            // Pop the top vertex
            std::string vertex = stack.top();
            stack.pop();
            
            // If not visited, process it
            if (visited.find(vertex) == visited.end()) {
                visited.insert(vertex);
                result.push_back(vertex);
                
                std::cout << "Visiting: " << vertex << std::endl;
                
                // Print stack contents (in reverse order since it's LIFO)
                std::cout << "Stack: [";
                std::vector<std::string> stackContents;
                std::stack<std::string> stackCopy = stack;
                while (!stackCopy.empty()) {
                    stackContents.push_back(stackCopy.top());
                    stackCopy.pop();
                }
                std::reverse(stackContents.begin(), stackContents.end());
                for (size_t i = 0; i < stackContents.size(); ++i) {
                    std::cout << stackContents[i];
                    if (i < stackContents.size() - 1) std::cout << ", ";
                }
                std::cout << "]" << std::endl;
                
                // Print visited vertices
                std::cout << "Visited so far: [";
                for (size_t i = 0; i < result.size(); ++i) {
                    std::cout << result[i];
                    if (i < result.size() - 1) std::cout << ", ";
                }
                std::cout << "]" << std::endl;
                std::cout << "------------------------------" << std::endl;
                
                // Pause for demonstration
                std::this_thread::sleep_for(std::chrono::milliseconds(500));
                
                // Get sorted neighbors in reverse order for stack
                std::vector<std::string> neighbors = getSortedNeighbors(vertex);
                std::reverse(neighbors.begin(), neighbors.end());
                
                // Push all unvisited neighbors onto the stack
                for (const auto& neighbor : neighbors) {
                    if (visited.find(neighbor) == visited.end()) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        
        return result;
    }
    
    // Print the graph structure
    void visualizeGraph() const {
        std::cout << "\nGraph Structure:" << std::endl;
        std::cout << "------------------------------" << std::endl;
        
        // Sort vertices for consistent output
        std::vector<std::string> vertices;
        for (const auto& pair : adjacencyList) {
            vertices.push_back(pair.first);
        }
        std::sort(vertices.begin(), vertices.end());
        
        for (const auto& vertex : vertices) {
            std::vector<std::string> neighbors = getSortedNeighbors(vertex);
            
            std::cout << vertex << " -> [";
            for (size_t i = 0; i < neighbors.size(); ++i) {
                std::cout << neighbors[i];
                if (i < neighbors.size() - 1) std::cout << ", ";
            }
            std::cout << "]" << std::endl;
        }
        
        std::cout << "------------------------------" << std::endl;
    }
};

// Create a sample graph for demonstration
Graph createSampleGraph() {
    Graph g;
    
    // Add edges to build this graph:
    //     A
    //    / \
    //   B   C
    //  / \   \
    // D   E---F
    
    std::vector<std::pair<std::string, std::string>> edges = {
        {"A", "B"}, {"A", "C"},
        {"B", "D"}, {"B", "E"},
        {"C", "F"}, {"E", "F"}
    };
    
    for (const auto& edge : edges) {
        g.addEdge(edge.first, edge.second);
    }
    
    return g;
}

// Main function
int main() {
    // Create a sample graph
    Graph g = createSampleGraph();
    g.visualizeGraph();
    
    // Demonstrate BFS
    std::cout << "\n=== BFS Traversal ===" << std::endl;
    std::vector<std::string> bfsResult = g.bfs("A");
    std::cout << "BFS Result: [";
    for (size_t i = 0; i < bfsResult.size(); ++i) {
        std::cout << bfsResult[i];
        if (i < bfsResult.size() - 1) std::cout << ", ";
    }
    std::cout << "]" << std::endl;
    
    // Demonstrate recursive DFS
    std::cout << "\n=== DFS Traversal (Recursive) ===" << std::endl;
    std::vector<std::string> dfsRecResult = g.dfsRecursive("A");
    std::cout << "DFS Recursive Result: [";
    for (size_t i = 0; i < dfsRecResult.size(); ++i) {
        std::cout << dfsRecResult[i];
        if (i < dfsRecResult.size() - 1) std::cout << ", ";
    }
    std::cout << "]" << std::endl;
    
    // Demonstrate iterative DFS
    std::cout << "\n=== DFS Traversal (Iterative) ===" << std::endl;
    std::vector<std::string> dfsIterResult = g.dfsIterative("A");
    std::cout << "DFS Iterative Result: [";
    for (size_t i = 0; i < dfsIterResult.size(); ++i) {
        std::cout << dfsIterResult[i];
        if (i < dfsIterResult.size() - 1) std::cout << ", ";
    }
    std::cout << "]" << std::endl;
    
    return 0;
} 
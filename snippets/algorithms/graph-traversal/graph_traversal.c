#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

/**
 * Graph Traversal Algorithms in C
 * 
 * This program demonstrates BFS and DFS traversal algorithms on a graph.
 * 
 * Compile: gcc graph_traversal.c -o graph_traversal
 * Run: ./graph_traversal
 */

#define MAX_VERTICES 10
#define MAX_VERTEX_NAME 10

// Graph structure using adjacency matrix
typedef struct {
    char vertices[MAX_VERTICES][MAX_VERTEX_NAME];
    int adjacency_matrix[MAX_VERTICES][MAX_VERTICES];
    int num_vertices;
} Graph;

// Queue for BFS traversal
typedef struct {
    int items[MAX_VERTICES];
    int front;
    int rear;
} Queue;

// Stack for iterative DFS traversal
typedef struct {
    int items[MAX_VERTICES];
    int top;
} Stack;

// Queue functions
Queue* create_queue() {
    Queue* q = (Queue*)malloc(sizeof(Queue));
    q->front = -1;
    q->rear = -1;
    return q;
}

int is_queue_empty(Queue* q) {
    return q->rear == -1;
}

void enqueue(Queue* q, int value) {
    if (q->rear == MAX_VERTICES - 1)
        return;
    else {
        if (q->front == -1)
            q->front = 0;
        q->rear++;
        q->items[q->rear] = value;
    }
}

int dequeue(Queue* q) {
    int item;
    if (is_queue_empty(q)) {
        return -1;
    } else {
        item = q->items[q->front];
        q->front++;
        if (q->front > q->rear) {
            q->front = q->rear = -1;
        }
        return item;
    }
}

// Stack functions
Stack* create_stack() {
    Stack* s = (Stack*)malloc(sizeof(Stack));
    s->top = -1;
    return s;
}

int is_stack_empty(Stack* s) {
    return s->top == -1;
}

void push(Stack* s, int value) {
    if (s->top == MAX_VERTICES - 1)
        return;
    else {
        s->top++;
        s->items[s->top] = value;
    }
}

int pop(Stack* s) {
    int item;
    if (is_stack_empty(s)) {
        return -1;
    } else {
        item = s->items[s->top];
        s->top--;
        return item;
    }
}

// Graph functions
Graph* create_graph() {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    g->num_vertices = 0;
    
    // Initialize adjacency matrix to 0
    for (int i = 0; i < MAX_VERTICES; i++) {
        for (int j = 0; j < MAX_VERTICES; j++) {
            g->adjacency_matrix[i][j] = 0;
        }
    }
    
    return g;
}

// Add a vertex to the graph
int add_vertex(Graph* g, const char* vertex) {
    if (g->num_vertices >= MAX_VERTICES) {
        printf("Graph is full, cannot add more vertices\n");
        return -1;
    }
    
    // Check if vertex already exists
    for (int i = 0; i < g->num_vertices; i++) {
        if (strcmp(g->vertices[i], vertex) == 0) {
            return i;
        }
    }
    
    // Add new vertex
    strcpy(g->vertices[g->num_vertices], vertex);
    return g->num_vertices++;
}

// Add an edge between two vertices
void add_edge(Graph* g, const char* v1, const char* v2) {
    // Ensure both vertices exist
    int v1_idx = add_vertex(g, v1);
    int v2_idx = add_vertex(g, v2);
    
    if (v1_idx == -1 || v2_idx == -1) {
        return;
    }
    
    // Add the edge (undirected graph)
    g->adjacency_matrix[v1_idx][v2_idx] = 1;
    g->adjacency_matrix[v2_idx][v1_idx] = 1;
}

// Print neighbors in sorted order
void print_sorted_neighbors(Graph* g, int vertex_idx) {
    // Create a sorted copy of neighbors
    int neighbors[MAX_VERTICES];
    int count = 0;
    
    for (int i = 0; i < g->num_vertices; i++) {
        if (g->adjacency_matrix[vertex_idx][i]) {
            neighbors[count++] = i;
        }
    }
    
    // Simple bubble sort
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - i - 1; j++) {
            if (strcmp(g->vertices[neighbors[j]], g->vertices[neighbors[j + 1]]) > 0) {
                int temp = neighbors[j];
                neighbors[j] = neighbors[j + 1];
                neighbors[j + 1] = temp;
            }
        }
    }
    
    printf("[");
    for (int i = 0; i < count; i++) {
        printf("%s", g->vertices[neighbors[i]]);
        if (i < count - 1) {
            printf(", ");
        }
    }
    printf("]");
}

// Get the index of a vertex by name
int get_vertex_index(Graph* g, const char* vertex) {
    for (int i = 0; i < g->num_vertices; i++) {
        if (strcmp(g->vertices[i], vertex) == 0) {
            return i;
        }
    }
    return -1;
}

// BFS traversal
void bfs(Graph* g, const char* start) {
    int start_idx = get_vertex_index(g, start);
    if (start_idx == -1) {
        printf("Starting vertex not found\n");
        return;
    }
    
    int visited[MAX_VERTICES] = {0};
    int result[MAX_VERTICES];
    int result_count = 0;
    
    Queue* q = create_queue();
    
    // Initialize with starting vertex
    visited[start_idx] = 1;
    enqueue(q, start_idx);
    
    printf("Starting BFS traversal from vertex %s\n", start);
    
    while (!is_queue_empty(q)) {
        // Dequeue the first vertex
        int vertex = dequeue(q);
        result[result_count++] = vertex;
        
        printf("Visiting: %s\n", g->vertices[vertex]);
        
        // Print queue contents
        printf("Queue: [");
        for (int i = q->front; i <= q->rear; i++) {
            printf("%s", g->vertices[q->items[i]]);
            if (i < q->rear) {
                printf(", ");
            }
        }
        printf("]\n");
        
        // Print visited vertices
        printf("Visited so far: [");
        for (int i = 0; i < result_count; i++) {
            printf("%s", g->vertices[result[i]]);
            if (i < result_count - 1) {
                printf(", ");
            }
        }
        printf("]\n");
        printf("------------------------------\n");
        
        // Pause for demonstration
        usleep(500000); // 500ms
        
        // Visit neighbors in sorted order
        int neighbors[MAX_VERTICES];
        int count = 0;
        
        for (int i = 0; i < g->num_vertices; i++) {
            if (g->adjacency_matrix[vertex][i]) {
                neighbors[count++] = i;
            }
        }
        
        // Simple bubble sort
        for (int i = 0; i < count - 1; i++) {
            for (int j = 0; j < count - i - 1; j++) {
                if (strcmp(g->vertices[neighbors[j]], g->vertices[neighbors[j + 1]]) > 0) {
                    int temp = neighbors[j];
                    neighbors[j] = neighbors[j + 1];
                    neighbors[j + 1] = temp;
                }
            }
        }
        
        // Enqueue all unvisited neighbors
        for (int i = 0; i < count; i++) {
            int neighbor = neighbors[i];
            if (!visited[neighbor]) {
                visited[neighbor] = 1;
                enqueue(q, neighbor);
            }
        }
    }
    
    free(q);
    
    // Print final result
    printf("BFS Result: [");
    for (int i = 0; i < result_count; i++) {
        printf("%s", g->vertices[result[i]]);
        if (i < result_count - 1) {
            printf(", ");
        }
    }
    printf("]\n");
}

// Helper for recursive DFS
void dfs_helper(Graph* g, int vertex, int* visited, int* result, int* result_count) {
    // Mark as visited and add to result
    visited[vertex] = 1;
    result[(*result_count)++] = vertex;
    
    printf("Visiting: %s\n", g->vertices[vertex]);
    
    // Print visited vertices
    printf("Visited so far: [");
    for (int i = 0; i < *result_count; i++) {
        printf("%s", g->vertices[result[i]]);
        if (i < *result_count - 1) {
            printf(", ");
        }
    }
    printf("]\n");
    printf("------------------------------\n");
    
    // Pause for demonstration
    usleep(500000); // 500ms
    
    // Visit neighbors in sorted order
    int neighbors[MAX_VERTICES];
    int count = 0;
    
    for (int i = 0; i < g->num_vertices; i++) {
        if (g->adjacency_matrix[vertex][i]) {
            neighbors[count++] = i;
        }
    }
    
    // Simple bubble sort
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - i - 1; j++) {
            if (strcmp(g->vertices[neighbors[j]], g->vertices[neighbors[j + 1]]) > 0) {
                int temp = neighbors[j];
                neighbors[j] = neighbors[j + 1];
                neighbors[j + 1] = temp;
            }
        }
    }
    
    // Recursively visit all unvisited neighbors
    for (int i = 0; i < count; i++) {
        int neighbor = neighbors[i];
        if (!visited[neighbor]) {
            dfs_helper(g, neighbor, visited, result, result_count);
        }
    }
}

// DFS traversal (recursive)
void dfs_recursive(Graph* g, const char* start) {
    int start_idx = get_vertex_index(g, start);
    if (start_idx == -1) {
        printf("Starting vertex not found\n");
        return;
    }
    
    int visited[MAX_VERTICES] = {0};
    int result[MAX_VERTICES];
    int result_count = 0;
    
    printf("Starting recursive DFS traversal from vertex %s\n", start);
    
    dfs_helper(g, start_idx, visited, result, &result_count);
    
    // Print final result
    printf("DFS Recursive Result: [");
    for (int i = 0; i < result_count; i++) {
        printf("%s", g->vertices[result[i]]);
        if (i < result_count - 1) {
            printf(", ");
        }
    }
    printf("]\n");
}

// DFS traversal (iterative)
void dfs_iterative(Graph* g, const char* start) {
    int start_idx = get_vertex_index(g, start);
    if (start_idx == -1) {
        printf("Starting vertex not found\n");
        return;
    }
    
    int visited[MAX_VERTICES] = {0};
    int result[MAX_VERTICES];
    int result_count = 0;
    
    Stack* s = create_stack();
    
    // Initialize with starting vertex
    push(s, start_idx);
    
    printf("Starting iterative DFS traversal from vertex %s\n", start);
    
    while (!is_stack_empty(s)) {
        // Pop the top vertex
        int vertex = pop(s);
        
        // If not visited, process it
        if (!visited[vertex]) {
            visited[vertex] = 1;
            result[result_count++] = vertex;
            
            printf("Visiting: %s\n", g->vertices[vertex]);
            
            // Print stack contents
            printf("Stack: [");
            for (int i = 0; i <= s->top; i++) {
                printf("%s", g->vertices[s->items[i]]);
                if (i < s->top) {
                    printf(", ");
                }
            }
            printf("]\n");
            
            // Print visited vertices
            printf("Visited so far: [");
            for (int i = 0; i < result_count; i++) {
                printf("%s", g->vertices[result[i]]);
                if (i < result_count - 1) {
                    printf(", ");
                }
            }
            printf("]\n");
            printf("------------------------------\n");
            
            // Pause for demonstration
            usleep(500000); // 500ms
            
            // Visit neighbors in reverse sorted order for stack
            int neighbors[MAX_VERTICES];
            int count = 0;
            
            for (int i = 0; i < g->num_vertices; i++) {
                if (g->adjacency_matrix[vertex][i]) {
                    neighbors[count++] = i;
                }
            }
            
            // Simple bubble sort (in reverse order)
            for (int i = 0; i < count - 1; i++) {
                for (int j = 0; j < count - i - 1; j++) {
                    if (strcmp(g->vertices[neighbors[j]], g->vertices[neighbors[j + 1]]) < 0) {
                        int temp = neighbors[j];
                        neighbors[j] = neighbors[j + 1];
                        neighbors[j + 1] = temp;
                    }
                }
            }
            
            // Push all unvisited neighbors onto the stack
            for (int i = 0; i < count; i++) {
                int neighbor = neighbors[i];
                if (!visited[neighbor]) {
                    push(s, neighbor);
                }
            }
        }
    }
    
    free(s);
    
    // Print final result
    printf("DFS Iterative Result: [");
    for (int i = 0; i < result_count; i++) {
        printf("%s", g->vertices[result[i]]);
        if (i < result_count - 1) {
            printf(", ");
        }
    }
    printf("]\n");
}

// Visualize the graph structure
void visualize_graph(Graph* g) {
    printf("\nGraph Structure:\n");
    printf("------------------------------\n");
    
    // Sort vertices for consistent output
    int sorted_indices[MAX_VERTICES];
    for (int i = 0; i < g->num_vertices; i++) {
        sorted_indices[i] = i;
    }
    
    // Simple bubble sort
    for (int i = 0; i < g->num_vertices - 1; i++) {
        for (int j = 0; j < g->num_vertices - i - 1; j++) {
            if (strcmp(g->vertices[sorted_indices[j]], g->vertices[sorted_indices[j + 1]]) > 0) {
                int temp = sorted_indices[j];
                sorted_indices[j] = sorted_indices[j + 1];
                sorted_indices[j + 1] = temp;
            }
        }
    }
    
    for (int i = 0; i < g->num_vertices; i++) {
        int vertex = sorted_indices[i];
        printf("%s -> ", g->vertices[vertex]);
        print_sorted_neighbors(g, vertex);
        printf("\n");
    }
    
    printf("------------------------------\n");
}

// Create a sample graph for demonstration
Graph* create_sample_graph() {
    Graph* g = create_graph();
    
    // Add edges to build this graph:
    //     A
    //    / \
    //   B   C
    //  / \   \
    // D   E---F
    
    add_edge(g, "A", "B");
    add_edge(g, "A", "C");
    add_edge(g, "B", "D");
    add_edge(g, "B", "E");
    add_edge(g, "C", "F");
    add_edge(g, "E", "F");
    
    return g;
}

int main() {
    // Create a sample graph
    Graph* g = create_sample_graph();
    visualize_graph(g);
    
    // Demonstrate BFS
    printf("\n=== BFS Traversal ===\n");
    bfs(g, "A");
    
    // Demonstrate recursive DFS
    printf("\n=== DFS Traversal (Recursive) ===\n");
    dfs_recursive(g, "A");
    
    // Demonstrate iterative DFS
    printf("\n=== DFS Traversal (Iterative) ===\n");
    dfs_iterative(g, "A");
    
    free(g);
    return 0;
} 
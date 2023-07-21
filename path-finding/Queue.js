'use strict';

// Node of linked list
class Node {
    constructor(content) {
        this.content = content;
        this.before = null;
        this.after = null;
    }
}

// Queue class that is implemented as a doubly linked list 
class Queue{
    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
    }
    push(item) {
        let itemNode = new Node(item);
        itemNode.before = this.last;
        if (this.length == 0) {
            this.first = itemNode;
        } else {
            this.last.after = itemNode;
        }
        this.last = itemNode;
        this.length++;
        return this;
    }
    shift() {
        if (this.length == 0) return;
        let ans = this.first.content;
        this.first = this.first.after;
        this.length--;
        return ans;
    }
}
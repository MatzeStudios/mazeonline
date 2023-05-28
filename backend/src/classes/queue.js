class Queue {
    constructor(capacity) {
        this.queue = new Array(capacity);
        this.head = 0;
        this.tail = 0;
    }

    enqueue(element) {
        if (this.tail === this.queue.length) {
            this.resize(2 * this.queue.length);
        }
        this.queue[this.tail] = element;
        this.tail++;
    }

    dequeue() {
        if (this.head === this.tail) {
            console.log("Queue is empty");
            return;
        }
        let element = this.queue[this.head];
        this.head++;
        if (this.tail - this.head <= this.queue.length / 4) {
            this.resize(this.queue.length / 2);
        }
        return element;
    }

    resize(capacity) {
        capacity = Math.ceil(capacity)
        let newArray = new Array(capacity);
            for (let i = 0; i < this.tail - this.head; i++) {
            newArray[i] = this.queue[this.head + i];
        }
        this.queue = newArray;
        this.tail = this.tail - this.head;
        this.head = 0;
    }

    isEmpty() {
        return this.head === this.tail;
    }
}

module.exports = Queue
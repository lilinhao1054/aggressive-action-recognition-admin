import { useState } from "react";

class Semaphore {
  constructor(value) {
    this.value = value;  // 信号量的初始值
    this.queue = [];  // 等待队列
  }

  // 尝试获取信号量
  async acquire() {
    if (this.value > 0) {
      // 如果信号量的值大于0，递减它并继续
      this.value--;
    } else {
      // 否则，创建一个新的Promise，并将它添加到等待队列
      await new Promise(resolve => this.queue.push(resolve));
    }
  }

  // 释放信号量
  release() {
    if (this.queue.length > 0) {
      // 如果等待队列中有等待的Promise，解析它的第一个
      const resolve = this.queue.shift();
      resolve();
    } else {
      // 否则，递增信号量的值
      this.value++;
    }
  }
}

export default function useSemaphore(initialValue) {
  const [semaphoreInstance] = useState(() => new Semaphore(initialValue));

  const acquire = async () => {
    await semaphoreInstance.acquire();
  };

  const release = () => {
    semaphoreInstance.release();
  };

  return { acquire, release };
}
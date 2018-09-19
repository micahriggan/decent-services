pragma solidity ^0.4.17;
import "./BillableWallet.sol";

contract TaskRunner {

  struct Task {
    address contractLocation;
    bytes4 callback;
    bytes data;
    address taskOwner;
    address billTo;
  }

  struct IncentivizedTask {
    Task task;
    uint incentive;
  }

  struct ScheduledTask {
    uint repeatTimes;
    uint lastRun;
    uint waitTime;
    IncentivizedTask scheduled;
  }

  mapping(address => mapping(address => uint)) userTaskIndex;
  ScheduledTask[] tasks;
  //Worker[] workers;

  function canRun(uint index) public view returns(bool) {
    return tasks[index].lastRun + tasks[index].waitTime < now && tasks[index].repeatTimes >= 0;
  }

  function addTask(bytes4 fn, address location, bytes params, uint repeatTimes, uint waitTime, uint incentive, address billableWallet) public {
    ScheduledTask memory task = ScheduledTask({
      repeatTimes: repeatTimes,
      lastRun: 0,
      waitTime: waitTime,
      scheduled: IncentivizedTask({
        task: Task({
          data: params,
          callback: fn,
          taskOwner: msg.sender,
          billTo: billableWallet,
          contractLocation: location
        }),
        incentive: incentive})
    });
    tasks.push(task);
    userTaskIndex[msg.sender][location] = tasks.length;
  }

  function updateTask(address contractLocation,  uint repeatTimes, uint waitTime, uint incentive, address billableWallet) public{
    uint taskIndex = userTaskIndex[msg.sender][contractLocation];
    tasks[taskIndex].repeatTimes = repeatTimes;
    tasks[taskIndex].waitTime = waitTime;
    tasks[taskIndex].scheduled.incentive = incentive;
    tasks[taskIndex].scheduled.task.billTo = billableWallet;
  }


  function run(uint index) public {
    require(canRun(index), "Task must be runnable");
    bool toDelete = false;
    tasks[index].lastRun = now;
    if(tasks[index].repeatTimes >= 1) {
      tasks[index].repeatTimes--;
    } else {
      toDelete = true;
    }
    IncentivizedTask storage toRun = tasks[index].scheduled;
    bool ran = toRun.task.contractLocation.call(toRun.task.callback, toRun.task.data);
    bool billed;
    (billed) = BillableWallet(toRun.task.billTo).bill(toRun.incentive);
    require(billed, "Billing must succeed");
    require(ran, "Running must succeed");
    if(toDelete) {
      // delete the index so it can't be updated
      userTaskIndex[msg.sender][toRun.task.contractLocation] = 0;
      // take the last task and put it in the current spot
      tasks[index] = tasks[tasks.length - 1];
      // set the last task's index to it's new position
      Task storage moved = tasks[index].scheduled.task;
      userTaskIndex[moved.taskOwner][moved.contractLocation] = index;
      delete tasks[tasks.length - 1];
    }
  }

  function taskAt(uint index) public view returns(address, bytes4, bytes, address, address) {
    Task storage thisTask = tasks[index].scheduled.task;
    bytes storage data = thisTask.data;
    bytes4 callback = thisTask.callback;
    address contractLocation = thisTask.contractLocation;
    address taskOwner = thisTask.taskOwner;
    address billTo = thisTask.billTo;
    return (contractLocation, callback, data, taskOwner, billTo);
  }
}

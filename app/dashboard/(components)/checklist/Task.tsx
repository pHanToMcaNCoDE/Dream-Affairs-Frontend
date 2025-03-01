'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { AssignIcon, DeleteIcon, DoneIcon } from './Icons';
import { format } from 'date-fns';
import { Calendar as CalenderIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import AssignPopover from './AssignPopover';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/ModalTwo';

type task = {
  decription: string;
  date: Date | undefined;
  assignee: string;
  done: boolean;
};

interface MyTasksProps {
  deleteTask: (index: number) => void;
  editItem: (index: number, item: task) => void;
  item: task;
  index: number;
}

export const Task = ({ deleteTask, item, index, editItem }: MyTasksProps) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [assignedMember, setAssignedMember] = useState('');
  const [done, setDone] = useState(false);
  const [editedTask, setEditedTask] = React.useState<task>(item);
  const error = false;

  useEffect(() => {
    setDate(item.date);
    setAssignedMember(item.assignee);
    setDescription(item.decription);
    setDone(item.done);
  }, [item]);

  useEffect(() => {
    setEditedTask({ decription: description, date: date, assignee: assignedMember, done: done });
  }, [date, assignedMember, description, done]);

  const handleAssignBlur = useCallback(() => {
    setTimeout(() => {
      setIsAssigning(false);
    }, 300);
  }, []);

  const updateAssignMember = (item: string) => {
    setAssignedMember(item);
  };

  const handleEditAssignee = useCallback(() => {
    editItem(index, editedTask);
  }, [index, editedTask, editItem]);

  return (
    <div
      onBlur={() => {
        setTimeout(() => {
          handleAssignBlur();
        }, 1000);
      }}
      className="w-full pr-9 pb-2 border-b border-neutral-100 flex-col justify-center items-start gap-2 inline-flex"
    >
      <div className="self-stretch justify-start items-start gap-2 inline-flex">
        {/* Check */}
        <div
          onClick={() => {
            setDone((prev) => !prev);
            editItem(index, { decription: description, date: date, assignee: assignedMember, done: !done });
          }}
          className={`min-w-[16px] h-[16px] mt-1 border-[2px] ${
            done ? 'border-transparent' : 'border-[#9F7DB5]'
          } rounded-[50%] hover:bg-primary-foreground cursor-pointer flex items-center justify-evenly`}
        >
          {done && <DoneIcon />}
        </div>
        <div className="w-full items-start grid grid-cols-3">
          {/* Description */}

          <div className="flex-col justify-start items-start gap-3 inline-flex">
            <input
              type="text"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => (description.length === 0 ? '' : editItem(index, editedTask))}
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  return description.length === 0 ? '' : editItem(index, editedTask);
                }
              }}
              className={`${done && 'line-through'} text-neutral-800 outline-none leading-snug`}
            />
            {/* Date */}
            <Popover>
              <PopoverTrigger
                className={cn(
                  ` text-sm  file:text-sm file:font-medium placeholder:text-gray-400 w-[115px]  disabled:cursor-not-allowed disabled:opacity-50 outline-none ring-0 transition-colors duration-200 ease-in-out border-0 hover:!bg-none cursor-pointer
           ${error && ' text-red-500 placeholder:text-red-500'}
      
          ${date && ' text-black'}`,
                )}
                asChild
              >
                <p
                  className={cn(
                    'flex items-center justify-start  text-left text-zinc-500 text-xs leading-none ',
                    !date && 'text-neutral-400',
                    done && 'line-through',
                  )}
                >
                  {date ? format(date, 'MMM dd') : <CalenderIcon className="mr-2 h-4 w-4" />}
                </p>
                {/* )} */}
              </PopoverTrigger>
              <PopoverContent
                onBlur={() => {
                  if (done) return;
                  editItem(index, { decription: description, date: date, assignee: assignedMember, done: done });
                }}
                className="w-auto translate-x-1/4 p-0"
              >
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assignee */}
          <div onClick={() => setIsAssigning(true)} className="justify-self-center relative">
            {assignedMember !== 'Assign Task' ? (
              <p className={`${done && 'line-through'} text-slate-600 leading-snug cursor-pointer`}>{assignedMember}</p>
            ) : (
              <AssignIcon stroke="#898C8F" />
            )}
            {isAssigning && (
              <AssignPopover
                handleBlur={handleAssignBlur}
                updateAssignMember={updateAssignMember}
                editAssignee={handleEditAssignee}
              />
            )}
          </div>

          {/* Delete */}
          <aside
            // onClick={() => deleteTask(index)}
            className="justify-self-end cursor-pointer"
          >
            <Modal
              width="700"
              showXIcon={false}
              btnTiggerText={<DeleteIcon />}
              btnTriggerStyle=""
              showCloseBtn={true}
              closeBtnText="Close"
              closeBtnStyle="bg-secondary p-4 rounded-md text-sm font-medium w-full mt-5"
              otherBtn={
                <DialogClose asChild>
                  <Button onClick={() => deleteTask(index)} variant="destructive" className="w-full mt-5">
                    Delete
                  </Button>
                </DialogClose>
              }
            >
              <div className="w-full flex-col justify-start items-start gap-3.5 inline-flex border-b border-gray-200 pb-8">
                <div className="flex flex-col justify-start items-start gap-4">
                  <h3 className="w-80 text-neutral-900 text-base font-medium  leading-snug">Delete task</h3>
                  <p className="self-stretch text-neutral-900 text-sm font-normal  leading-tight">
                    Are you sure you want to delete create guest list from your tasks
                  </p>
                </div>
              </div>
            </Modal>
          </aside>
        </div>
      </div>
    </div>
  );
};
export default Task;

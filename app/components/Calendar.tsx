"use client";
import { useState, useEffect } from "react";
import MainCalendar from "react-calendar";
import { X } from "lucide-react";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarMainProps {
  onClose?: () => void;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export default function CalendarMain({
  onClose,
  onDateRangeChange,
}: CalendarMainProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>("");

  // Quick selection options
  const quickOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "Past 2 Weeks", value: "past2Weeks" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Year", value: "thisYear" },
    { label: "Last Year", value: "lastYear" },
  ];

  // Handle quick selection
  const handleQuickSelection = (option: string) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (option) {
      case "today":
        start = today;
        end = today;
        break;
      case "yesterday":
        start = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        end = start;
        break;
      case "thisWeek":
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
        break;
      case "lastWeek":
        const lastWeekStart = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        const dayOfLastWeek = lastWeekStart.getDay();
        const diffLastWeek =
          lastWeekStart.getDate() -
          dayOfLastWeek +
          (dayOfLastWeek === 0 ? -6 : 1);
        start = new Date(lastWeekStart.setDate(diffLastWeek));
        end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
        break;
      case "past2Weeks":
        start = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        end = today;
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "lastYear":
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedRange(option);

    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
  };

  // Handle manual date inputs
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStartDate(date);
    setSelectedRange("");

    if (onDateRangeChange) {
      onDateRangeChange(date, endDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndDate(date);
    setSelectedRange("");

    if (onDateRangeChange) {
      onDateRangeChange(startDate, date);
    }
  };

  // Handle calendar selection
  const handleCalendarChange = (value: Value) => {
    if (Array.isArray(value) && value.length === 2) {
      setStartDate(value[0]);
      setEndDate(value[1]);
      setSelectedRange("");

      if (onDateRangeChange) {
        onDateRangeChange(value[0], value[1]);
      }
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".calendar-dropdown") &&
        !target.closest(".calendar-trigger")
      ) {
        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // useEffect(()=>{
  //   if(selectedDateRange.start && selectedDateRange.end){

  //   }

  // },[])

  return (
    <div className="calendar-dropdown absolute z-50 mt-2 right-0 bg-[#002134BD] backdrop-blur-sm rounded-xl p-6 w-full max-w-4xl shadow-lg border border-gray-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Select Date Range</h3>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Quick Selections */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white mb-4">
            Quick Selections
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {quickOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickSelection(option.value)}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedRange === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Calendar and Manual Input */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">
              Custom Date Range
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  onChange={handleStartDateChange}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-[#0a1929] text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  onChange={handleEndDateChange}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-[#0a1929] text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Calendar</h4>
            <div className="bg-[#0a1929] rounded-lg p-4">
              <MainCalendar
                onChange={handleCalendarChange}
                value={startDate && endDate ? [startDate, endDate] : null}
                selectRange={true}
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const isStart =
                      startDate &&
                      date.toDateString() === startDate.toDateString();
                    const isEnd =
                      endDate && date.toDateString() === endDate.toDateString();
                    const isInRange =
                      startDate &&
                      endDate &&
                      date > startDate &&
                      date < endDate;

                    if (isStart || isEnd) {
                      return "bg-blue-500 text-white rounded-lg";
                    }
                    if (isInRange) {
                      return "bg-blue-300 text-white rounded-lg";
                    }
                  }
                  return "hover:bg-white/20 rounded-lg";
                }}
                className="w-full text-white"
              />
            </div>
          </div>

          {/* Selected Range Display */}
          {(startDate || endDate) && (
            <div className="bg-[#0a1929] rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Selected Range:</h5>
              <p className="text-white/80">
                {startDate ? startDate.toLocaleDateString() : "Not set"} -{" "}
                {endDate ? endDate.toLocaleDateString() : "Not set"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

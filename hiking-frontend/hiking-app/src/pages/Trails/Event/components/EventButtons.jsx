import { memo } from "react";
import { Button } from "antd";

const EventButtons = ({
  join,
  leave,
  update,
  handleDeleteEvent,
  isUserJoined,
  isCreator,
  isAdmin = false,
}) => {
  // Show update and delete buttons if user is creator OR admin
  const canModify = isCreator || isAdmin;
  
  if (canModify) {
    return (
      <div className="button-delete-and-update">
        {isCreator && (
          <Button
            className="basic-btn green update-delete-btn button-update"
            onClick={update}
          >
            UPDATE
          </Button>
        )}
        <Button
          className="basic-btn green update-delete-btn"
          onClick={handleDeleteEvent}
        >
          DELETE
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="join-leave">
        {!isCreator && !isUserJoined && (
          <Button
            className="basic-btn green join-leave-btn"
            data-type="join"
            onClick={join}
          >
            JOIN
          </Button>
        )}
        {!isCreator && isUserJoined && (
          <Button
            className="basic-btn green join-leave-btn"
            data-type="leave"
            onClick={leave}
          >
            LEAVE
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(EventButtons);

import { memo } from "react";
import { Button, Modal } from "antd";
import InputField from "../../../components/Shared/InputField/InputField";

const CustomModal = ({
  modalVisible,
  handleCancel,
  updateEvent,
  onChangeHandler,
  form,
}) => {
  <Modal
    title="Event Details"
    open={true}
    // visible={modalVisible}
    onCancel={handleCancel}
    footer={[
      <Button key="cancel" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button key="save" type="primary" onClick={updateEvent}>
        Update Event
      </Button>,
    ]}
  >
    <div className="info-of-creating-event">
      <div className="name-of-event-creating">
        <p>TITLE OF EVENT</p>
        <InputField
          value={form?.title || ""}
          onChange={(e) =>
            onChangeHandler({
              value: e.target.value,
              name: "title",
            })
          }
        />
        <p>DESCRIPTION</p>
        <InputField
          value={form.description || ""}
          onChange={(e) =>
            onChangeHandler({
              value: e.target.value,
              name: "description",
            })
          }
        />
        <p>SET DATE</p>
        <InputField
          type="date"
          value={form?.date || ""}
          onChange={(e) =>
            onChangeHandler({
              value: e.target.value,
              name: "date",
            })
          }
        />
        <p>SET TIME</p>
        <InputField
          type="time"
          value={form?.time || ""}
          onChange={(e) =>
            onChangeHandler({
              value: e.target.value,
              name: "time",
            })
          }
        />
      </div>
    </div>
  </Modal>;
};

export default memo(CustomModal);

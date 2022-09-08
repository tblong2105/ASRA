import { memo, useEffect, useRef, useState } from "react"
import { Editor } from "@tinymce/tinymce-react";
import { Col, Form, Input, Row } from "antd";

function Confirmation({ handleChangeDescription, handleOnEditorChange, wordCount, textCount, description, cx }: any) {
  const [descriptionValideMessage, setDescriptionValideMessage] = useState<boolean>(false)
  const tinyRef = useRef()
  useEffect(() => {
    if(description.length > 500){
      setDescriptionValideMessage(true)
    }else {
      setDescriptionValideMessage(false)
    }
  }, [description]);

  return (
    <div className={cx("infomation_container")}>
      <p className={cx("title")}>Confirmation</p>
      <Row className={cx("form_data")}>
        <Col span={24}>
          <Row className={cx("information-row")}>
            <Col span={24}>
              <Form.Item
                label="Title Of The Post"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input title of the post!",
                  },
                  {
                    max: 70
                  },
                ]}
              >
                <Input
                  className={cx("input")}
                  placeholder="Enter title of your post"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className={cx("information-row")}>
            <Col span={24}>
              <div className="room-des-label">
                <div className="ant-form-item-label">
                  <label htmlFor="">Room Description</label>
                </div>
              </div>
              <Editor
                onChange={handleChangeDescription}
                onEditorChange={handleOnEditorChange}
                initialValue={description}
                apiKey="zq4p2ro5ru1jxfmdjl5thp3i6tbsrs05da8yufc8sr7cntxv"
                init={{
                  height: 500,
                  menubar: false,
                  paste_block_drop: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </Col>
            <div style={{textAlign: "left"}}>
            {/* <p style={{ marginTop: "10px", marginBottom: "0px"}}>{wordCount > 500 ? <div className="ant-form-item-explain-error">You can only be up to 500 words!</div> : ""}</p> */}
            <p style={{ marginTop: "2px", marginBottom: "0px"}}>{textCount > 10000 ? <div className="ant-form-item-explain-error">You can only be up to 10000 characters</div> : ""}</p>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default memo(Confirmation);

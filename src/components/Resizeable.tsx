import { Rnd } from "react-rnd";

export default function CustomResizable({ children }) {
  const styles: any = {
    resize: {
      // position: "absolute",
      backgroundColor: "red",
    },
  };

  // function handlePosition(a){
  //   console.log(a)
  // }

  return (
    <Rnd
      style={{ backgroundColor: "red" }}
      maxWidth={500}
      minWidth={100}
      onDragStop={(e, d) => {
        console.log(e, d);
      }}
      lockAspectRatio={true}
    >
      {children}
    </Rnd>
  );
}

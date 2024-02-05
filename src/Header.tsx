import { primary45 } from "./utils/colors.ts";

export default function Header() {
  const styles: any = {
    container: {
      backgroundColor: primary45,
      color: "#FFF",
      padding: 12,
      fontWeight: 600,
      textAlign: "center",
    },
  };
  return (
    <div style={styles.container}>
      <div>LENS E-SIGNATURE</div>
    </div>
  );
}

import { StyleSheet, Text, View } from "react-native";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        informative:
          "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function Badge({
  variant,
  text,
}: {
  variant: string;
  text: string;
}) {
  return (
    <View className={`badge ${badgeVariants[variant]}`}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    fontSize: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  primary: {
    backgroundColor: "blue",
  },
  secondary: {
    backgroundColor: "yellow",
  },
  outline: {
    borderColor: "white",
  },
});

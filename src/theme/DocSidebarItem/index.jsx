import DocSidebarItem from "@theme-original/DocSidebarItem";
import clsx from "clsx";
import { BookOpenText, House } from "lucide-react";
import style from "./style.module.css";
const iconMapping = {
  home: <House size={16} />,
  tutorial: <BookOpenText size={16} />,
  default: null,
};
function CustomDocSidebarItem(props) {
  const { item } = props;
  console.log("custom doc sidebar item:", props, item.label.toLowerCase());

  return (
    <div className={clsx("menu__list-item", style.mysidebaritem)}>
      <span className={style.mysidebaricon}>
        {iconMapping[item.label.toLowerCase()] || iconMapping.default}
      </span>
      <DocSidebarItem {...props} />
    </div>
  );
}

export default CustomDocSidebarItem;

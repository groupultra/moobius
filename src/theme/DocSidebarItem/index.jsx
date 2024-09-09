import DocSidebarItem from "@theme-original/DocSidebarItem";
import clsx from "clsx";
import {
  BookMarked,
  BookOpenText,
  House,
  Target,
  TvMinimal,
  Wrench,
  Zap,
} from "lucide-react";
import style from "./style.module.css";
const iconMapping = {
  home: <House size={16} />,
  introduction: <BookOpenText size={16} />,
  "getting started": <Target size={16} />,
  "custom channel service": <TvMinimal size={16} />,
  "build your first gba": <Wrench size={16} />,
  "quick reference": <Zap size={16} />,
  "advanced reference": <BookMarked size={16} />,
  default: null,
};
function CustomDocSidebarItem(props) {
  const { item } = props;

  return (
    <div className={clsx("menu__list-item", style.mysidebaritem)}>
      <span className={style.mysidebaricon}>
        {iconMapping[item?.label?.toLowerCase()] || iconMapping.default}
      </span>
      <DocSidebarItem {...props} />
    </div>
  );
}

export default CustomDocSidebarItem;

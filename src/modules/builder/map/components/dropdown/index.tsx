import { MarkerProps } from '../../types';

interface Props {
  itemsList: MarkerProps[];
  setSelectedItem: (val: MarkerProps) => void;
  closeMenu: () => void;
}

const DropDown = ({
  itemsList,
  setSelectedItem,
  closeMenu,
}: Props): JSX.Element => {
  const handleSetDropdownValue = (value: MarkerProps) => {
    setSelectedItem(value);
    closeMenu();
  };

  return (
    <div>
      {itemsList.map((ele: MarkerProps) => (
        <div className="dropdown-item" key={ele.title}>
          <button
            className="dropdown__link"
            onClick={() => handleSetDropdownValue(ele)}
            type="button"
          >
            {ele.title}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DropDown;

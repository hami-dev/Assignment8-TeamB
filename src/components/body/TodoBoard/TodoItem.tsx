import { ReactElement, useState, useEffect } from 'react';
import { TodoSideTab, TodoItemDetail } from 'components/body';
import { STATUS } from 'constants/index';
import { useSideTab } from 'utils/index';
import styled from 'styled-components';

interface TodoItemProps {
  id: number;
  index: number;
  taskName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  importance: string;
  handleDragStart: (e: React.DragEvent<HTMLLIElement>, id: number) => void;
  onSubmit: (setDrag: (drag: boolean) => void) => void;
}

function TodoItem({
  id,
  index,
  taskName,
  status,
  createdAt,
  updatedAt,
  importance,
  handleDragStart,
  onSubmit,
}: TodoItemProps): ReactElement {
  const {
    isOpen,
    setIsOpen,
    fade,
    onBackgroundClick,
    onItemClick,
    onAnimationEnd,
  } = useSideTab();
  const [statIcon, setStatIcon] = useState<string>('🤍');
  const [importanceIcon, setImportanceIcon] = useState<string>('');
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    if (!isEnd) {
      onSubmit(setIsDrag);
    }
  }, [isDrag, isEnd]);

  useEffect(() => {
    checkStatus();
    checkImportance();
  }, [importance, isOpen]);

  const checkStatus = () => {
    switch (status) {
      case STATUS.NOT_STARTED:
        setStatIcon('💚');
        break;
      case STATUS.ONGOING:
        setStatIcon('💛');
        break;
      case STATUS.FINISHED:
        setStatIcon('💖');
        break;
      default:
        setStatIcon('🤍');
        break;
    }
  };

  const checkImportance = () => {
    switch (importance) {
      case 'high':
        setImportanceIcon('🔥');
        break;
      case 'low':
        setImportanceIcon('🎵');
        break;
      default:
        setImportanceIcon('🧨');
        break;
    }
  };

  const onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    setIsDrag(true);
    handleDragStart(e, index);
  };

  // const onDragEnd = () => {
  //   //같은 보드에 떨어져야 end가 남
  //   console.log('onDragEnd');
  //   setIsEnd(true);
  //   setIsDrag(false);
  // };

  const onDrop = () => {
    // 마우스에서 손 떼기만 하면 실행됨
    console.log('end222');
    setIsEnd(true);
    setIsDrag(false);
  };

  return (
    <>
      <ItemWrapper
        data-index={index}
        isDrag={isDrag}
        draggable
        onDragStart={onDragStart}
        // onDragEnd={onDragEnd}
        onDrop={onDrop}
      >
        <ItemStatusIcon>{statIcon}</ItemStatusIcon>
        <ItemContentWrapper>
          <ItemTitle onClick={onItemClick}>{taskName}</ItemTitle>
          <ItemContent>created at {createdAt}</ItemContent>
          <ItemContent>{importanceIcon}</ItemContent>
        </ItemContentWrapper>
      </ItemWrapper>
      {isOpen && (
        <>
          <TodoSideTab
            fade={fade}
            setIsOpen={setIsOpen}
            onAnimationEnd={onAnimationEnd}
          >
            <TodoItemDetail
              id={id}
              taskName={taskName}
              status={statIcon}
              createdAt={createdAt}
              updatedAt={updatedAt}
              importance={importance}
            />
          </TodoSideTab>
          <BackGround onClick={onBackgroundClick}></BackGround>
        </>
      )}
    </>
  );
}

export const ItemWrapper = styled.li<{ isDrag: boolean }>`
  display: flex;
  line-height: 2rem;
  font-size: 1.5rem;
  box-shadow: 0rem 0.3rem 0.9rem -0.8rem #0000003b;
  background-color: #fff;
  border: 1px solid #eeeeee;
  border-radius: 1rem;
  margin: 0 1.8rem;
  margin-bottom: 1rem;
  padding: 1.5rem 0.8rem;
  cursor: move;

  opacity: ${({ isDrag }) => (isDrag ? 0.5 : 1)};
  background-color: ${({ isDrag }) => (isDrag ? '#e0e0e0' : '#fff')};
`;

const ItemStatusIcon = styled.div`
  font-size: 1.3rem;
`;

const ItemContentWrapper = styled.div`
  margin-left: 0.8rem;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  cursor: pointer;
  color: #242424;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const ItemContent = styled.div`
  font-size: 1.4rem;
  color: #a9a9a9;
`;

export const BackGround = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #00000036;
  z-index: 1;
`;

export default TodoItem;

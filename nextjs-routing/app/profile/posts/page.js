import Item from '@/components/Item';
import styles from './Posts.module.css';

const item_data = [
  {id: 1, text: "Great product", datetime: "September 14 2026 7:15am", author: "Joe"},   
  {id: 2, text: "Bad product", datetime: "September 13 2026 9:33pm", author: "Nageeb"},
  {id: 3, text: "This is great", datetime: "September 13 2026 4:45qm", author: "Mary"},
  {id: 4, text: "I don't like it", datetime: "September 12 2026 5:23pm", author: "Jane"},
  {id: 5, text: "It could be better", datetime: "September 12 2026 3:56am", author: "Yi"},
  {id: 6, text: "It's the worst", datetime: "September 12 2026 6:24pm", author: "Arif"},
  {id: 7, text: "Best ever", datetime: "September 10 2026 1:17pm", author: "Sally"},
  {id: 8, text: "It's OK", datetime: "September 9 2026 10:42am", author: "Kamala"}
];

export default function PostsPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Posts</h2>
      <div className={styles.items}>
        {item_data.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

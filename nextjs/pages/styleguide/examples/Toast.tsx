import Example from '../Example';
import Button from 'components/Button';
import { toast } from 'components/Toast';

export default function TextareaExample() {
  return (
    <Example header="Toast">
      <Example description="Toasts can have different states.">
        <div>
          <Button onClick={() => toast.success('Lorem ipsum')}>Success</Button>
        </div>
        <div>
          <Button onClick={() => toast.error('Lorem ipsum')}>Error</Button>
        </div>
        <div>
          <Button onClick={() => toast.info('Lorem ipsum')}>info</Button>
        </div>
      </Example>
    </Example>
  );
}

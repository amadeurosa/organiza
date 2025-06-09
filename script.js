$(function () {
  let calendario; // para o Calendario

  // Funções
  function renderTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
    const ul = $('#painel-tarefas ul');
    ul.empty();
    tarefas.forEach((t, i) => {
      ul.append(`
        <li>
          <input type="checkbox"> ${t}
          <button class="excluir-tarefa" data-index="${i}">✖</button>
        </li>
      `);
    });
  }

  function renderNotas() {
    const notas = JSON.parse(localStorage.getItem('notas') || '[]');
    const container = $('#painel-notas');
    container.empty();
    notas.forEach((nota, i) => {
      container.append(`
        <div class="nota">
          <button class="excluir-nota" data-index="${i}">✖</button>
          <strong>${nota.titulo}</strong>
          <p>${nota.texto}</p>
        </div>
      `);
    });
  }

  function renderEventos() {
    if (calendario) {
      calendario.removeAllEvents();
      const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
      eventos.forEach((e, i) => {
        calendario.addEvent({
          title: e.title,
          start: e.start,
          extendedProps: { index: i }
        });
      });
    }
  }

  function resetarFormulario() {
    $('.tipo-btn').removeClass('ativo');
    $('.formulario').addClass('oculto');
    $('input, textarea').val('');
  }

  // Inicializar dados
  renderTarefas();
  renderNotas();

  // FullCalendar
  calendario = new FullCalendar.Calendar(document.getElementById('calendario'), {
    initialView: 'dayGridMonth',
    height: 600,
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: function (info) {
      if (confirm(`Excluir evento "${info.event.title}"?`)) {
        const index = info.event.extendedProps.index;
        const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
        eventos.splice(index, 1);
        localStorage.setItem('eventos', JSON.stringify(eventos));
        renderEventos();
      }
    }
  });

  calendario.render();
  renderEventos();

  // Alternância entre abas
  $('.aba').click(function () {
    const alvo = $(this).data('aba');
    $('.aba').removeClass('ativa');
    $(this).addClass('ativa');
    $('.painel').addClass('oculto');
    $('#painel-' + alvo).removeClass('oculto');

    if (alvo === 'calendario') {
      setTimeout(() => {
        calendario.render();
      }, 100);
    }
  });

  // Alternância via menu lateral
  $('.nav-item').click(function () {
    const alvo = $(this).data('aba');
    $('.nav-item').removeClass('ativo');
    $(this).addClass('ativo');
    $('.aba[data-aba="' + alvo + '"]').click();
  });

  // Abrir modal
  $('.nova-tarefa').click(function () {
    $('#modal-adicionar').removeClass('oculto');
    resetarFormulario();
  });

  // Fechar modal
  $('#cancelar-adicao').click(function () {
    $('#modal-adicionar').addClass('oculto');
    resetarFormulario();
  });

  // Selecionar tipo
  $('.tipo-btn').click(function () {
    $('.tipo-btn').removeClass('ativo');
    $(this).addClass('ativo');
    const tipo = $(this).data('tipo');
    $('.formulario').addClass('oculto');
    $('.tipo-' + tipo).removeClass('oculto');
    $('#confirmar-adicao').data('tipo', tipo);
  });

  // Confirmar adição
  $('#confirmar-adicao').click(function () {
    const tipo = $(this).data('tipo');

    if (tipo === 'tarefa') {
      const texto = $('#input-tarefa').val().trim();
      if (texto) {
        const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
        tarefas.push(texto);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderTarefas();
      }
    }

    if (tipo === 'nota') {
      const titulo = $('#input-nota').val().trim();
      const texto = $('#textarea-nota').val().trim();
      if (titulo && texto) {
        const notas = JSON.parse(localStorage.getItem('notas') || '[]');
        notas.push({ titulo, texto });
        localStorage.setItem('notas', JSON.stringify(notas));
        renderNotas();
      }
    }

    if (tipo === 'evento') {
      const nome = $('#input-evento').val().trim();
      const data = $('#data-evento').val();
      if (nome && data) {
        const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
        eventos.push({ title: nome, start: data });
        localStorage.setItem('eventos', JSON.stringify(eventos));
        renderEventos();
      }
    }

    $('#modal-adicionar').addClass('oculto');
    resetarFormulario();
  });

  // Exclusão
  $(document).on('click', '.excluir-tarefa', function () {
    const index = $(this).data('index');
    const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');
    tarefas.splice(index, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderTarefas();
  });

  $(document).on('click', '.excluir-nota', function () {
    const index = $(this).data('index');
    const notas = JSON.parse(localStorage.getItem('notas') || '[]');
    notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(notas));
    renderNotas();
  });
});

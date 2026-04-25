from game import TicTacToe
from ai import AI

def play(game, x_player, o_player, print_game=True):
    if print_game:
        game.print_board_nums()

    letter = 'X'
    while game.empty_squares():
        if letter == 'O' and o_player is not None:
            square = o_player.get_move(game)
        elif letter == 'X' and x_player is not None:
            square = x_player.get_move(game)
        else:
            # Human move
            valid_square = False
            val = None
            while not valid_square:
                square = input(f'{letter}\'s turn. Input move (0-8): ')
                try:
                    val = int(square)
                    if val not in game.available_moves():
                        raise ValueError
                    valid_square = True
                except ValueError:
                    print('Invalid square. Try again.')
            square = val

        if game.make_move(square, letter):
            if print_game:
                print(f'{letter} makes a move to square {square}')
                game.print_board()
                print('')

            if game.current_winner:
                if print_game:
                    print(f'{letter} wins!')
                return letter

            letter = 'O' if letter == 'X' else 'X'

    if print_game:
        print('It\'s a tie!')

if __name__ == '__main__':
    print("Welcome to Tic-Tac-Toe!")
    mode = input("Choose AI difficulty (easy/hard): ").strip().lower()
    if mode not in ['easy', 'hard']:
        print("Invalid choice, defaulting to hard.")
        mode = 'hard'
    
    player_choice = input("Do you want to be X or O? (X goes first): ").strip().upper()
    if player_choice not in ['X', 'O']:
        print("Invalid choice, defaulting to X.")
        player_choice = 'X'

    ai_letter = 'O' if player_choice == 'X' else 'X'
    ai_player = AI(ai_letter, difficulty=mode)
    
    game = TicTacToe()
    
    if player_choice == 'X':
        play(game, None, ai_player, print_game=True)
    else:
        play(game, ai_player, None, print_game=True)
